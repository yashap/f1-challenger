import { required } from '@f1-challenger/errors'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { buildPaginatedResponse } from './buildPaginatedResponse'
import { Cursor, decodeCursor } from './Cursor'
import { OrderDirection, OrderDirectionValues } from './orderDirection'

describe(buildPaginatedResponse.name, () => {
  type UserCursor = Cursor<'age', number>
  type UserPagination = Omit<UserCursor, 'lastOrderValueSeen' | 'lastIdSeen'>

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

  it('builds a paginated response for descending sort order, with proper cursors', () => {
    /**
     * This page, users with age:
     * 19, 18, 17, 16, 15, 14, 13, 12, 11, 10
     *
     * Previous page:
     * - The next 10 youngest users who are older than 19
     * - So it should be ascending orer, but older than 19
     *
     * Next page:
     * - The next 10 oldest users who are younger than 10
     * - So it should be descending order, but younger than 10
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
    const previousCursor = decodeCursor(required(paginatedResponse.pagination.previous), parseUserOrdering)
    expect(previousCursor).toStrictEqual({
      ...pagination,
      lastIdSeen: required(users[0]).id,
      lastOrderValueSeen: required(users[0]).age,
      orderDirection: OrderDirectionValues.asc,
    })
    const nextCursor = decodeCursor(required(paginatedResponse.pagination.next), parseUserOrdering)
    expect(nextCursor).toStrictEqual({
      ...pagination,
      lastIdSeen: required(users[users.length - 1]).id,
      lastOrderValueSeen: required(users[users.length - 1]).age,
    })
  })

  it('builds a paginated response for ascending sort order, with proper cursors', () => {
    /**
     * This page, users with age:
     * 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
     *
     * Previous page:
     * - The next 10 oldest users who are younger than 10
     * - So it should be descending order, but younger than 10
     *
     * Next page:
     * - The next 10 youngest users who are older than 19
     * - So it should be ascending order, but older than 19
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
    const previousCursor = decodeCursor(required(paginatedResponse.pagination.previous), parseUserOrdering)
    expect(previousCursor).toStrictEqual({
      ...pagination,
      lastIdSeen: required(users[0]).id,
      lastOrderValueSeen: required(users[0]).age,
      orderDirection: OrderDirectionValues.desc,
    })
    const nextCursor = decodeCursor(required(paginatedResponse.pagination.next), parseUserOrdering)
    expect(nextCursor).toStrictEqual({
      ...pagination,
      lastIdSeen: required(users[users.length - 1]).id,
      lastOrderValueSeen: required(users[users.length - 1]).age,
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
