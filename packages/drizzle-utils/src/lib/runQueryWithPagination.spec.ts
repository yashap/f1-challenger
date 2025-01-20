import { InstantStringSchema } from '@f1-challenger/api-client-utils'
import { required } from '@f1-challenger/errors'
import {
  buildPaginatedResponse,
  Cursor,
  OrderDirectionValues,
  PaginationRequestDto,
  parsePagination,
} from '@f1-challenger/pagination'
import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'
import { Post, TestDb, User } from '../test/TestDb'
import { postTable, userTable } from '../test/testSchema'
import { runQueryWithPagination } from './runQueryWithPagination'

describe(runQueryWithPagination.name, () => {
  const baseTimestamp = Temporal.Instant.fromEpochSeconds(1_000_000)
  let user: User
  let posts: Post[]

  const createUser = async (name: string): Promise<User> => {
    const result = await TestDb.db().insert(userTable).values({ name }).returning()
    expect(result).toHaveLength(1)
    return required(result[0])
  }

  const createPost = async (sentAt: Temporal.Instant, message = 'Test Message', author: User = user): Promise<Post> => {
    const result = await TestDb.db().insert(postTable).values({ authorId: author.id, message, sentAt }).returning()
    expect(result).toHaveLength(1)
    return required(result[0])
  }

  const createPosts = async (
    count: number,
    initialTimestamp: Temporal.Instant = baseTimestamp,
    secondsBetweenPosts = 1,
    author: User = user
  ): Promise<Post[]> => {
    const posts = []
    for (let i = 0; i < count; i++) {
      posts.push(await createPost(initialTimestamp.add({ seconds: i * secondsBetweenPosts }), `Post ${i}`, author))
    }
    return posts
  }

  beforeEach(async () => {
    user = await createUser('Bob')
    posts = await createPosts(10)
  })

  it('should fetch the first page, in ascending order', async () => {
    const foundPosts = await runQueryWithPagination(
      {
        orderBy: 'sentAt',
        orderDirection: OrderDirectionValues.asc,
        limit: 3,
      },
      postTable,
      async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      }
    )

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(0, 3))
  })

  it('should fetch the second page, in ascending order', async () => {
    const lastPostSeen = required(posts[2])

    const foundPosts = await runQueryWithPagination(
      {
        orderBy: 'sentAt',
        orderDirection: OrderDirectionValues.asc,
        limit: 3,
        lastOrderValueSeen: lastPostSeen.sentAt,
        lastIdSeen: lastPostSeen.id,
      },
      postTable,
      async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      }
    )

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(3, 6))
  })

  it('should fetch the first page, in descending order', async () => {
    const foundPosts = await runQueryWithPagination(
      {
        orderBy: 'sentAt',
        orderDirection: OrderDirectionValues.desc,
        limit: 3,
      },
      postTable,
      async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      }
    )

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(-3).reverse())
  })

  it('should fetch the second page, in descending order', async () => {
    const lastPostSeen = required(posts[7])

    const foundPosts = await runQueryWithPagination(
      {
        orderBy: 'sentAt',
        orderDirection: OrderDirectionValues.desc,
        limit: 3,
        lastOrderValueSeen: lastPostSeen.sentAt,
        lastIdSeen: lastPostSeen.id,
      },
      postTable,
      async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      }
    )

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(4, 7).reverse())
  })

  describe('interaction with pagination utils', () => {
    type PostCursor = Cursor<'sentAt', Temporal.Instant>
    const PostOrderingSchema = z.object({
      orderBy: z.literal('sentAt'),
      lastOrderValueSeen: InstantStringSchema,
    })
    const parsePostOrdering = (ordering: {
      orderBy: unknown
      lastOrderValueSeen: unknown
    }): Pick<PostCursor, 'orderBy' | 'lastOrderValueSeen'> => {
      return PostOrderingSchema.parse(ordering)
    }

    it('allows paging forward and backwards through items, starting in ascending order', async () => {
      const initalPaginationRequest: PaginationRequestDto = {
        orderBy: 'sentAt',
        orderDirection: OrderDirectionValues.asc,
        limit: 3,
      }

      // Fetch first page (posts at index 0, 1, 2)
      const initalPagination = parsePagination(initalPaginationRequest, parsePostOrdering)
      const initialPage = await runQueryWithPagination(initalPagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(initialPage).toHaveLength(3)
      expect(initialPage).toStrictEqual(posts.slice(0, 3))

      // Fetch second page (posts at index 3, 4, 5)
      const initialPageResponse = buildPaginatedResponse(initialPage, initalPagination)
      expect(initialPageResponse.pagination.next).toBeDefined()
      expect(initialPageResponse.pagination.previous).toBeDefined()
      const secondPagePagination = parsePagination({ cursor: initialPageResponse.pagination.next }, parsePostOrdering)
      const secondPage = await runQueryWithPagination(secondPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(secondPage).toHaveLength(3)
      expect(secondPage).toStrictEqual(posts.slice(3, 6))

      // Fetch third page (posts at index 6, 7, 8)
      const secondPageResponse = buildPaginatedResponse(secondPage, secondPagePagination)
      expect(secondPageResponse.pagination.next).toBeDefined()
      expect(secondPageResponse.pagination.previous).toBeDefined()
      const thirdPagePagination = parsePagination({ cursor: secondPageResponse.pagination.next }, parsePostOrdering)
      const thirdPage = await runQueryWithPagination(thirdPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(thirdPage).toHaveLength(3)
      expect(thirdPage).toStrictEqual(posts.slice(6, 9))

      // Fetch fourth page (post at index 9)
      const thirdPageResponse = buildPaginatedResponse(thirdPage, thirdPagePagination)
      expect(thirdPageResponse.pagination.next).toBeDefined()
      expect(thirdPageResponse.pagination.previous).toBeDefined()
      const fourthPagePagination = parsePagination({ cursor: thirdPageResponse.pagination.next }, parsePostOrdering)
      const fourthPage = await runQueryWithPagination(fourthPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(fourthPage).toHaveLength(1)
      expect(fourthPage).toStrictEqual(posts.slice(9))

      // Fetch fifth page (no posts)
      const fourthPageResponse = buildPaginatedResponse(fourthPage, fourthPagePagination)
      expect(fourthPageResponse.pagination.next).toBeDefined()
      expect(fourthPageResponse.pagination.previous).toBeDefined()
      const fifthPagePagination = parsePagination({ cursor: fourthPageResponse.pagination.next }, parsePostOrdering)
      const fifthPage = await runQueryWithPagination(fifthPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(fifthPage).toHaveLength(0)

      // Fetch previous from fourth page
      const oneBackFromFourthPagePagination = parsePagination(
        { cursor: fourthPageResponse.pagination.previous },
        parsePostOrdering
      )
      const oneBackFromFourthPage = await runQueryWithPagination(
        oneBackFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(oneBackFromFourthPage).toHaveLength(3)
      expect(oneBackFromFourthPage).toStrictEqual(thirdPage)

      // Continue backwards
      const twoBackFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(oneBackFromFourthPage, oneBackFromFourthPagePagination).pagination.previous,
        },
        parsePostOrdering
      )
      const twoBackFromFourthPage = await runQueryWithPagination(
        twoBackFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(twoBackFromFourthPage).toHaveLength(3)
      expect(twoBackFromFourthPage).toStrictEqual(secondPage)

      // Continue backwards
      const threeBackFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(twoBackFromFourthPage, twoBackFromFourthPagePagination).pagination.previous,
        },
        parsePostOrdering
      )
      const threeBackFromFourthPage = await runQueryWithPagination(
        threeBackFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(threeBackFromFourthPage).toHaveLength(3)
      expect(threeBackFromFourthPage).toStrictEqual(initialPage)

      // Continue backwards
      const fourBackFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(threeBackFromFourthPage, threeBackFromFourthPagePagination).pagination
            .previous,
        },
        parsePostOrdering
      )
      const fourBackFromFourthPage = await runQueryWithPagination(
        fourBackFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(fourBackFromFourthPage).toHaveLength(0)
    })

    it('allows paging forward and backwards through items, starting in descending order', async () => {
      const initalPaginationRequest: PaginationRequestDto = {
        orderBy: 'sentAt',
        orderDirection: OrderDirectionValues.desc,
        limit: 3,
      }

      // Fetch first page (posts at index 9, 8, 7)
      const initalPagination = parsePagination(initalPaginationRequest, parsePostOrdering)
      const initialPage = await runQueryWithPagination(initalPagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(initialPage).toHaveLength(3)
      expect(initialPage).toStrictEqual(posts.slice(-3).reverse())

      // Fetch second page (posts at index 6, 5, 4)
      const initialPageResponse = buildPaginatedResponse(initialPage, initalPagination)
      expect(initialPageResponse.pagination.next).toBeDefined()
      expect(initialPageResponse.pagination.previous).toBeDefined()
      const secondPagePagination = parsePagination({ cursor: initialPageResponse.pagination.next }, parsePostOrdering)
      const secondPage = await runQueryWithPagination(secondPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(secondPage).toHaveLength(3)
      expect(secondPage).toStrictEqual(posts.slice(4, 7).reverse())

      // Fetch third page (posts at index 3, 2, 1)
      const secondPageResponse = buildPaginatedResponse(secondPage, secondPagePagination)
      expect(secondPageResponse.pagination.next).toBeDefined()
      expect(secondPageResponse.pagination.previous).toBeDefined()
      const thirdPagePagination = parsePagination({ cursor: secondPageResponse.pagination.next }, parsePostOrdering)
      const thirdPage = await runQueryWithPagination(thirdPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(thirdPage).toHaveLength(3)
      expect(thirdPage).toStrictEqual(posts.slice(1, 4).reverse())

      // Fetch fourth page (post at index 0)
      const thirdPageResponse = buildPaginatedResponse(thirdPage, thirdPagePagination)
      expect(thirdPageResponse.pagination.next).toBeDefined()
      expect(thirdPageResponse.pagination.previous).toBeDefined()
      const fourthPagePagination = parsePagination({ cursor: thirdPageResponse.pagination.next }, parsePostOrdering)
      const fourthPage = await runQueryWithPagination(fourthPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(fourthPage).toHaveLength(1)
      expect(fourthPage).toStrictEqual(posts.slice(0, 1).reverse())

      // Fetch fifth page (no posts)
      const fourthPageResponse = buildPaginatedResponse(fourthPage, fourthPagePagination)
      expect(fourthPageResponse.pagination.next).toBeDefined()
      expect(fourthPageResponse.pagination.previous).toBeDefined()
      const fifthPagePagination = parsePagination({ cursor: fourthPageResponse.pagination.next }, parsePostOrdering)
      const fifthPage = await runQueryWithPagination(fifthPagePagination, postTable, async (pagination) => {
        return TestDb.db().query.postTable.findMany(pagination)
      })
      expect(fifthPage).toHaveLength(0)

      // Fetch previous from fourth page
      const oneBackwardsFromFourthPagePagination = parsePagination(
        { cursor: fourthPageResponse.pagination.previous },
        parsePostOrdering
      )
      const oneBackwardsFromFourthPage = await runQueryWithPagination(
        oneBackwardsFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(oneBackwardsFromFourthPage).toHaveLength(3)
      expect(oneBackwardsFromFourthPage).toStrictEqual(thirdPage)

      // Continue backwards
      const twoBackwardsFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(oneBackwardsFromFourthPage, oneBackwardsFromFourthPagePagination).pagination
            .previous,
        },
        parsePostOrdering
      )
      const twoBackwardsFromFourthPage = await runQueryWithPagination(
        twoBackwardsFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(twoBackwardsFromFourthPage).toHaveLength(3)
      expect(twoBackwardsFromFourthPage).toStrictEqual(secondPage)

      // Continue backwards
      const threeBackwardsFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(twoBackwardsFromFourthPage, twoBackwardsFromFourthPagePagination).pagination
            .previous,
        },
        parsePostOrdering
      )
      const threeBackwardsFromFourthPage = await runQueryWithPagination(
        threeBackwardsFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(threeBackwardsFromFourthPage).toHaveLength(3)
      expect(threeBackwardsFromFourthPage).toStrictEqual(initialPage)

      // Continue backwards
      const fourBackwardsFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(threeBackwardsFromFourthPage, threeBackwardsFromFourthPagePagination)
            .pagination.previous,
        },
        parsePostOrdering
      )
      const fourBackwardsFromFourthPage = await runQueryWithPagination(
        fourBackwardsFromFourthPagePagination,
        postTable,
        async (pagination) => {
          return TestDb.db().query.postTable.findMany(pagination)
        }
      )
      expect(fourBackwardsFromFourthPage).toHaveLength(0)
    })
  })
})
