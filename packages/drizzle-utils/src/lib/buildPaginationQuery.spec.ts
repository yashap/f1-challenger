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
import { buildPaginationQuery } from './buildPaginationQuery'

describe(buildPaginationQuery.name, () => {
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
    const { where, orderBy, limit } = buildPaginationQuery(postTable, {
      orderBy: 'sentAt',
      orderDirection: OrderDirectionValues.asc,
      limit: 3,
    })
    expect(where).toBeUndefined()
    expect(orderBy).toBeDefined()
    expect(limit).toBeDefined()

    const foundPosts = await TestDb.db().query.postTable.findMany({
      where,
      orderBy,
      limit,
    })

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(0, 3))
  })

  it('should fetch the second page, in ascending order', async () => {
    const lastPostSeen = required(posts[2])
    const { where, orderBy, limit } = buildPaginationQuery(postTable, {
      orderBy: 'sentAt',
      orderDirection: OrderDirectionValues.asc,
      limit: 3,
      lastOrderValueSeen: lastPostSeen.sentAt,
      lastIdSeen: lastPostSeen.id,
    })

    expect(where).toBeDefined()
    expect(orderBy).toBeDefined()
    expect(limit).toBeDefined()

    const foundPosts = await TestDb.db().query.postTable.findMany({
      where,
      orderBy,
      limit,
    })

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(3, 6))
  })

  it('should fetch the first page, in descending order', async () => {
    const { where, orderBy, limit } = buildPaginationQuery(postTable, {
      orderBy: 'sentAt',
      orderDirection: OrderDirectionValues.desc,
      limit: 3,
    })
    expect(where).toBeUndefined()
    expect(orderBy).toBeDefined()
    expect(limit).toBeDefined()

    const foundPosts = await TestDb.db().query.postTable.findMany({
      where,
      orderBy,
      limit,
    })

    expect(foundPosts).toHaveLength(3)
    expect(foundPosts).toStrictEqual(posts.slice(-3).reverse())
  })

  it('should fetch the second page, in descending order', async () => {
    const lastPostSeen = required(posts[7])
    const { where, orderBy, limit } = buildPaginationQuery(postTable, {
      orderBy: 'sentAt',
      orderDirection: OrderDirectionValues.desc,
      limit: 3,
      lastOrderValueSeen: lastPostSeen.sentAt,
      lastIdSeen: lastPostSeen.id,
    })

    expect(where).toBeDefined()
    expect(orderBy).toBeDefined()
    expect(limit).toBeDefined()

    const foundPosts = await TestDb.db().query.postTable.findMany({
      where,
      orderBy,
      limit,
    })

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
      const initialQuery = buildPaginationQuery(postTable, initalPagination)
      const initialPage = await TestDb.db().query.postTable.findMany(initialQuery)
      expect(initialPage).toHaveLength(3)
      expect(initialPage).toStrictEqual(posts.slice(0, 3))

      // Fetch second page (posts at index 3, 4, 5)
      const initialPageResponse = buildPaginatedResponse(initialPage, initalPagination)
      expect(initialPageResponse.pagination.next).toBeDefined()
      expect(initialPageResponse.pagination.previous).toBeDefined()
      const secondPagePagination = parsePagination({ cursor: initialPageResponse.pagination.next }, parsePostOrdering)
      const secondPageQuery = buildPaginationQuery(postTable, secondPagePagination)
      const secondPage = await TestDb.db().query.postTable.findMany(secondPageQuery)
      expect(secondPage).toHaveLength(3)
      expect(secondPage).toStrictEqual(posts.slice(3, 6))

      // Fetch third page (posts at index 6, 7, 8)
      const secondPageResponse = buildPaginatedResponse(secondPage, secondPagePagination)
      expect(secondPageResponse.pagination.next).toBeDefined()
      expect(secondPageResponse.pagination.previous).toBeDefined()
      const thirdPagePagination = parsePagination({ cursor: secondPageResponse.pagination.next }, parsePostOrdering)
      const thirdPageQuery = buildPaginationQuery(postTable, thirdPagePagination)
      const thirdPage = await TestDb.db().query.postTable.findMany(thirdPageQuery)
      expect(thirdPage).toHaveLength(3)
      expect(thirdPage).toStrictEqual(posts.slice(6, 9))

      // Fetch fourth page (post at index 9)
      const thirdPageResponse = buildPaginatedResponse(thirdPage, thirdPagePagination)
      expect(thirdPageResponse.pagination.next).toBeDefined()
      expect(thirdPageResponse.pagination.previous).toBeDefined()
      const fourthPagePagination = parsePagination({ cursor: thirdPageResponse.pagination.next }, parsePostOrdering)
      const fourthPageQuery = buildPaginationQuery(postTable, fourthPagePagination)
      const fourthPage = await TestDb.db().query.postTable.findMany(fourthPageQuery)
      expect(fourthPage).toHaveLength(1)
      expect(fourthPage).toStrictEqual(posts.slice(9))

      // Fetch fifth page (no posts)
      const fourthPageResponse = buildPaginatedResponse(fourthPage, fourthPagePagination)
      expect(fourthPageResponse.pagination.next).toBeDefined()
      expect(fourthPageResponse.pagination.previous).toBeDefined()
      const fifthPagePagination = parsePagination({ cursor: fourthPageResponse.pagination.next }, parsePostOrdering)
      const fifthPageQuery = buildPaginationQuery(postTable, fifthPagePagination)
      const fifthPage = await TestDb.db().query.postTable.findMany(fifthPageQuery)
      expect(fifthPage).toHaveLength(0)

      // Fetch previous from fourth page
      const oneBackFromFourthPagePagination = parsePagination(
        { cursor: fourthPageResponse.pagination.previous },
        parsePostOrdering
      )
      const oneBackFromFourthPageQuery = buildPaginationQuery(postTable, oneBackFromFourthPagePagination)
      const oneBackFromFourthPage = await TestDb.db().query.postTable.findMany(oneBackFromFourthPageQuery)
      expect(oneBackFromFourthPage).toHaveLength(3)
      expect(oneBackFromFourthPage).toStrictEqual(posts.slice(6, 9).reverse())

      // Continue backwards
      const twoBackFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(oneBackFromFourthPage, oneBackFromFourthPagePagination).pagination.next,
        },
        parsePostOrdering
      )
      const twoBackFromFourthPageQuery = buildPaginationQuery(postTable, twoBackFromFourthPagePagination)
      const twoBackFromFourthPage = await TestDb.db().query.postTable.findMany(twoBackFromFourthPageQuery)
      expect(twoBackFromFourthPage).toHaveLength(3)
      expect(twoBackFromFourthPage).toStrictEqual(posts.slice(3, 6).reverse())

      // Continue backwards
      const threeBackFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(twoBackFromFourthPage, twoBackFromFourthPagePagination).pagination.next,
        },
        parsePostOrdering
      )
      const threeBackFromFourthPageQuery = buildPaginationQuery(postTable, threeBackFromFourthPagePagination)
      const threeBackFromFourthPage = await TestDb.db().query.postTable.findMany(threeBackFromFourthPageQuery)
      expect(threeBackFromFourthPage).toHaveLength(3)
      expect(threeBackFromFourthPage).toStrictEqual(posts.slice(0, 3).reverse())

      // Continue backwards
      const fourBackFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(threeBackFromFourthPage, threeBackFromFourthPagePagination).pagination.next,
        },
        parsePostOrdering
      )
      const fourBackFromFourthPageQuery = buildPaginationQuery(postTable, fourBackFromFourthPagePagination)
      const fourBackFromFourthPage = await TestDb.db().query.postTable.findMany(fourBackFromFourthPageQuery)
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
      const initialQuery = buildPaginationQuery(postTable, initalPagination)
      const initialPage = await TestDb.db().query.postTable.findMany(initialQuery)
      expect(initialPage).toHaveLength(3)
      expect(initialPage).toStrictEqual(posts.slice(-3).reverse())

      // Fetch second page (posts at index 6, 5, 4)
      const initialPageResponse = buildPaginatedResponse(initialPage, initalPagination)
      expect(initialPageResponse.pagination.next).toBeDefined()
      expect(initialPageResponse.pagination.previous).toBeDefined()
      const secondPagePagination = parsePagination({ cursor: initialPageResponse.pagination.next }, parsePostOrdering)
      const secondPageQuery = buildPaginationQuery(postTable, secondPagePagination)
      const secondPage = await TestDb.db().query.postTable.findMany(secondPageQuery)
      expect(secondPage).toHaveLength(3)
      expect(secondPage).toStrictEqual(posts.slice(4, 7).reverse())

      // Fetch third page (posts at index 3, 2, 1)
      const secondPageResponse = buildPaginatedResponse(secondPage, secondPagePagination)
      expect(secondPageResponse.pagination.next).toBeDefined()
      expect(secondPageResponse.pagination.previous).toBeDefined()
      const thirdPagePagination = parsePagination({ cursor: secondPageResponse.pagination.next }, parsePostOrdering)
      const thirdPageQuery = buildPaginationQuery(postTable, thirdPagePagination)
      const thirdPage = await TestDb.db().query.postTable.findMany(thirdPageQuery)
      expect(thirdPage).toHaveLength(3)
      expect(thirdPage).toStrictEqual(posts.slice(1, 4).reverse())

      // Fetch fourth page (post at index 0)
      const thirdPageResponse = buildPaginatedResponse(thirdPage, thirdPagePagination)
      expect(thirdPageResponse.pagination.next).toBeDefined()
      expect(thirdPageResponse.pagination.previous).toBeDefined()
      const fourthPagePagination = parsePagination({ cursor: thirdPageResponse.pagination.next }, parsePostOrdering)
      const fourthPageQuery = buildPaginationQuery(postTable, fourthPagePagination)
      const fourthPage = await TestDb.db().query.postTable.findMany(fourthPageQuery)
      expect(fourthPage).toHaveLength(1)
      expect(fourthPage).toStrictEqual(posts.slice(0, 1).reverse())

      // Fetch fifth page (no posts)
      const fourthPageResponse = buildPaginatedResponse(fourthPage, fourthPagePagination)
      expect(fourthPageResponse.pagination.next).toBeDefined()
      expect(fourthPageResponse.pagination.previous).toBeDefined()
      const fifthPagePagination = parsePagination({ cursor: fourthPageResponse.pagination.next }, parsePostOrdering)
      const fifthPageQuery = buildPaginationQuery(postTable, fifthPagePagination)
      const fifthPage = await TestDb.db().query.postTable.findMany(fifthPageQuery)
      expect(fifthPage).toHaveLength(0)

      // Fetch previous from fourth page
      const oneForwardsFromFourthPagePagination = parsePagination(
        { cursor: fourthPageResponse.pagination.previous },
        parsePostOrdering
      )
      const oneForwardsFromFourthPageQuery = buildPaginationQuery(postTable, oneForwardsFromFourthPagePagination)
      const oneForwardsFromFourthPage = await TestDb.db().query.postTable.findMany(oneForwardsFromFourthPageQuery)
      expect(oneForwardsFromFourthPage).toHaveLength(3)
      expect(oneForwardsFromFourthPage).toStrictEqual(posts.slice(1, 4))

      // Continue forwards
      const twoForwardsFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(oneForwardsFromFourthPage, oneForwardsFromFourthPagePagination).pagination
            .next,
        },
        parsePostOrdering
      )
      const twoForwardsFromFourthPageQuery = buildPaginationQuery(postTable, twoForwardsFromFourthPagePagination)
      const twoForwardsFromFourthPage = await TestDb.db().query.postTable.findMany(twoForwardsFromFourthPageQuery)
      expect(twoForwardsFromFourthPage).toHaveLength(3)
      expect(twoForwardsFromFourthPage).toStrictEqual(posts.slice(4, 7))

      // Continue forwards
      const threeForwardsFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(twoForwardsFromFourthPage, twoForwardsFromFourthPagePagination).pagination
            .next,
        },
        parsePostOrdering
      )
      const threeForwardsFromFourthPageQuery = buildPaginationQuery(postTable, threeForwardsFromFourthPagePagination)
      const threeForwardsFromFourthPage = await TestDb.db().query.postTable.findMany(threeForwardsFromFourthPageQuery)
      expect(threeForwardsFromFourthPage).toHaveLength(3)
      expect(threeForwardsFromFourthPage).toStrictEqual(posts.slice(7, 10))

      // Continue forwards
      const fourForwardsFromFourthPagePagination = parsePagination(
        {
          cursor: buildPaginatedResponse(threeForwardsFromFourthPage, threeForwardsFromFourthPagePagination).pagination
            .next,
        },
        parsePostOrdering
      )
      const fourForwardsFromFourthPageQuery = buildPaginationQuery(postTable, fourForwardsFromFourthPagePagination)
      const fourForwardsFromFourthPage = await TestDb.db().query.postTable.findMany(fourForwardsFromFourthPageQuery)
      expect(fourForwardsFromFourthPage).toHaveLength(0)
    })
  })
})
