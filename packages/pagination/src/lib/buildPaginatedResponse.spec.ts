import { required } from '@f1-challenger/errors'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { buildPaginatedResponse } from './buildPaginatedResponse'
import { AsPagination, Cursor, decodeCursor } from './Cursor'
import { OrderDirection, OrderDirectionValues } from './orderDirection'

describe(buildPaginatedResponse.name, () => {
  type UserCursor = Cursor<'age', number>
  type UserPagination = AsPagination<UserCursor>

  interface User {
    id: string
    age: number
  }

  const OrderingSchema = z.object({
    orderBy: z.literal('age'),
    lastOrderValueSeen: z.number(),
  })

  const parseUserOrdering = (ordering: {
    orderBy: unknown
    lastOrderValueSeen: unknown
  }): Pick<UserCursor, 'orderBy' | 'lastOrderValueSeen'> => {
    return OrderingSchema.parse(ordering)
  }

  const buildUser = (age: number): User => ({ id: uuid(), age })
  const buildUsers = (count: number, sortOrder: OrderDirection, baseAge = 10): User[] => {
    const ascendingUsers = Array.from({ length: count }, (_, i) => buildUser(i + baseAge))
    if (sortOrder === OrderDirectionValues.asc) {
      return ascendingUsers
    }
    return ascendingUsers.reverse()
  }

  it('builds a paginated response for an initial page for ascending sort order, with proper cursors', () => {
    /**
     * This page, users with age:
     * 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
     *
     * Next page:
     * - The next 10 youngest users who are older than 19
     * - So it should be ascending order, but older than 19
     * - And the order `20, 21, 22, ...` is already correct
     *
     * Previous page:
     * - The next 10 oldest users who are younger than 10
     * - So it should be descending order, but younger than 10
     * - However, we want it to be "the page before", so not in the order `9, 8, 7, ...`, but the order `..., 7, 8, 9`
     *   - This need to flip is implied by orderDirection and initialOrderDirection being different
     */
    const limit = 10
    const users = buildUsers(limit, OrderDirectionValues.asc)
    const pagination: UserPagination = {
      limit,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.asc,
    }
    const paginatedResponse = buildPaginatedResponse(users, pagination)

    expect(paginatedResponse.data).toStrictEqual(users)
    expect(paginatedResponse.pagination.previous).toBeDefined()
    expect(paginatedResponse.pagination.next).toBeDefined()

    const nextCursor = decodeCursor(required(paginatedResponse.pagination.next), parseUserOrdering)
    expect(nextCursor).toStrictEqual({
      ...pagination,
      initialOrderDirection: OrderDirectionValues.asc,
      lastIdSeen: required(users[users.length - 1]).id,
      lastOrderValueSeen: required(users[users.length - 1]).age,
    })

    const previousCursor = decodeCursor(required(paginatedResponse.pagination.previous), parseUserOrdering)
    expect(previousCursor).toStrictEqual({
      ...pagination,
      orderDirection: OrderDirectionValues.desc,
      initialOrderDirection: OrderDirectionValues.asc,
      lastIdSeen: required(users[0]).id,
      lastOrderValueSeen: required(users[0]).age,
    })
  })

  it('builds a paginated response for an initial page for descending sort order, with proper cursors', () => {
    /**
     * This page, users with age:
     * 19, 18, 17, 16, 15, 14, 13, 12, 11, 10
     *
     * Next page:
     * - The next 10 oldest users who are younger than 10
     * - So it should be descending order, but younger than 10
     * - And the order `9, 8, 7, ...` is already correct
     *
     * Previous page:
     * - The next 10 youngest users who are older than 19
     * - So it should be ascending order, but older than 19
     * - However, we want it to be "the page before", so not in the order `20, 21, 22, ...`, but the order `..., 22, 21, 20`
     *   - This need to flip is implied by orderDirection and initialOrderDirection being different
     */
    const limit = 10
    const users = buildUsers(limit, OrderDirectionValues.desc)
    const pagination: UserPagination = {
      limit,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.desc,
    }
    const paginatedResponse = buildPaginatedResponse(users, pagination)
    expect(paginatedResponse.data).toStrictEqual(users)
    expect(paginatedResponse.pagination.previous).toBeDefined()
    expect(paginatedResponse.pagination.next).toBeDefined()

    const nextCursor = decodeCursor(required(paginatedResponse.pagination.next), parseUserOrdering)
    expect(nextCursor).toStrictEqual({
      ...pagination,
      initialOrderDirection: OrderDirectionValues.desc,
      lastIdSeen: required(users[users.length - 1]).id,
      lastOrderValueSeen: required(users[users.length - 1]).age,
    })

    const previousCursor = decodeCursor(required(paginatedResponse.pagination.previous), parseUserOrdering)
    expect(previousCursor).toStrictEqual({
      ...pagination,
      orderDirection: OrderDirectionValues.asc,
      initialOrderDirection: OrderDirectionValues.desc,
      lastIdSeen: required(users[0]).id,
      lastOrderValueSeen: required(users[0]).age,
    })
  })

  it('builds a paginated response for a subsequent page for ascending sort order, where the initial order was descending, with proper cursors', () => {
    /**
     * This page (older than 9 ascending, then reversed) would have been this before reversing:
     *   10, 11, 12, 13, 14, 15, 16, 17, 18, 19
     * But then after reversing:
     *   19, 18, 17, 16, 15, 14, 13, 12, 11, 10
     *
     * Next and prev are with respect to the initial ordering. As the initial ordering was descending, next should have
     * values smaller than what we've seen (less than 10), while prev should have values larger than what we've seen
     * (greater than 19).
     *
     * Next page:
     * - The next 10 oldest users who are younger than 10
     * - So it should be descending order, but younger than 10
     * - And the order `9, 8, 7, ...` is already correct
     *
     * Previous page:
     * - The next 10 youngest users who are older than 19, but reversed
     * - So it should be ascending order, but older than 19
     * - However, the order `20, 21, 22, ...` is incorrect, we want it to be `..., 22, 21, 20`
     *   - This need to flip is implied by orderDirection and initialOrderDirection being different
     */
    const limit = 10
    const users = buildUsers(limit, OrderDirectionValues.asc).reverse()
    const pagination: UserPagination = {
      limit,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.asc,
      initialOrderDirection: OrderDirectionValues.desc,
      lastOrderValueSeen: 9,
      lastIdSeen: 'someId',
    }
    const paginatedResponse = buildPaginatedResponse(users, pagination)
    expect(paginatedResponse.data).toStrictEqual(users)
    expect(paginatedResponse.pagination.previous).toBeDefined()
    expect(paginatedResponse.pagination.next).toBeDefined()

    const nextCursor = decodeCursor(required(paginatedResponse.pagination.next), parseUserOrdering)
    expect(nextCursor).toStrictEqual({
      ...pagination,
      orderDirection: OrderDirectionValues.desc,
      lastIdSeen: required(users[users.length - 1]).id,
      lastOrderValueSeen: required(users[users.length - 1]).age,
    })

    const previousCursor = decodeCursor(required(paginatedResponse.pagination.previous), parseUserOrdering)
    expect(previousCursor).toStrictEqual({
      ...pagination,
      orderDirection: OrderDirectionValues.asc,
      lastIdSeen: required(users[0]).id,
      lastOrderValueSeen: required(users[0]).age,
    })
  })

  it('builds a paginated response for a subsequent page for descending sort order, where the initial order was ascending, with proper cursors', () => {
    /**
     * This page (younger than 20 descending, then reversed) would have been this before reversing:
     *   19, 18, 17, 16, 15, 14, 13, 12, 11, 10
     * But then after reversing:
     *   10, 11, 12, 13, 14, 15, 16, 17, 18, 19
     *
     * Next and prev are with respect to the initial ordering. As the initial ordering was ascending, next should have
     * values larger than what we've seen (greater than 19), while prev should have values smaller than what we've seen
     * (less than 10).
     *
     * Next page:
     * - The next 10 youngest users who are older than 19
     * - So it should be ascending order, but older than 19
     * - And the order `20, 21, 22, ...` is aleady correct
     *
     * Previous page:
     * - The next 10 oldest users who are younger than 10
     * - So it should be descending order, but younger than 10
     * - However, the order `9, 8, 7, ...` is incorrect, we want it to be `..., 7, 8, 9`
     *   - This need to flip is implied by orderDirection and initialOrderDirection being different
     */
    const limit = 10
    const users = buildUsers(limit, OrderDirectionValues.desc).reverse()
    const pagination: UserPagination = {
      limit,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.desc,
      initialOrderDirection: OrderDirectionValues.asc,
      lastOrderValueSeen: 20,
      lastIdSeen: 'someId',
    }
    const paginatedResponse = buildPaginatedResponse(users, pagination)
    expect(paginatedResponse.data).toStrictEqual(users)
    expect(paginatedResponse.pagination.previous).toBeDefined()
    expect(paginatedResponse.pagination.next).toBeDefined()

    const nextCursor = decodeCursor(required(paginatedResponse.pagination.next), parseUserOrdering)
    expect(nextCursor).toStrictEqual({
      ...pagination,
      orderDirection: OrderDirectionValues.asc,
      lastIdSeen: required(users[users.length - 1]).id,
      lastOrderValueSeen: required(users[users.length - 1]).age,
    })

    const previousCursor = decodeCursor(required(paginatedResponse.pagination.previous), parseUserOrdering)
    expect(previousCursor).toStrictEqual({
      ...pagination,
      orderDirection: OrderDirectionValues.desc,
      lastIdSeen: required(users[0]).id,
      lastOrderValueSeen: required(users[0]).age,
    })
  })

  it('builds a response with no cursors if the list is empty', () => {
    const users: User[] = []
    const pagination: UserPagination = {
      limit: 10,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.asc,
    }
    const paginatedResponse = buildPaginatedResponse(users, pagination)
    expect(paginatedResponse.data).toStrictEqual(users)
    expect(paginatedResponse.pagination.previous).toBeUndefined()
    expect(paginatedResponse.pagination.next).toBeUndefined()
  })
})
