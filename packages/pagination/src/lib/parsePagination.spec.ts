import { InputValidationError } from '@f1-challenger/errors'
import { z } from 'zod'
import { Cursor, encodeCursor } from './Cursor'
import { OrderDirectionValues } from './orderDirection'
import { PaginationRequestDto } from './paginationDto'
import { parsePagination } from './parsePagination'

describe(parsePagination.name, () => {
  type UserCursor = Cursor<'age' | 'name', number | string>
  const OrderingSchema = z.union([
    z.object({
      orderBy: z.literal('age'),
      // String input, number output
      lastOrderValueSeen: z.coerce.number(),
    }),
    z.object({
      orderBy: z.literal('name'),
      lastOrderValueSeen: z.string(),
    }),
  ])
  const parseUserOrdering = (ordering: {
    orderBy: unknown
    lastOrderValueSeen: unknown
  }): Pick<UserCursor, 'orderBy' | 'lastOrderValueSeen'> => {
    return OrderingSchema.parse(ordering)
  }

  it('parses a first request, with no cursor', () => {
    const dto: PaginationRequestDto = {
      limit: 10,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.asc,
    }
    const parsedPaginationDetails = parsePagination(dto, parseUserOrdering)
    expect(parsedPaginationDetails).toEqual(dto)
  })

  it('parses a request with a cursor', () => {
    const cursor: UserCursor = {
      limit: 10,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.asc,
      initialOrderDirection: OrderDirectionValues.asc,
      lastOrderValueSeen: '10',
      lastIdSeen: '1',
    }
    const dto: PaginationRequestDto = {
      cursor: encodeCursor(cursor),
    }
    const parsedPaginationDetails = parsePagination(dto, parseUserOrdering)
    expect(parsedPaginationDetails).toEqual({
      ...cursor,
      lastOrderValueSeen: 10,
    })
  })

  it('throws an error if the cursor is not remotely valid', () => {
    const dto: PaginationRequestDto = {
      cursor: 'invalid',
    }
    expect(() => parsePagination(dto, parseUserOrdering)).toThrow(InputValidationError)
  })

  it('throws an error if the cursor is slightly invalid', () => {
    const dto: PaginationRequestDto = {
      cursor: encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: '10',
        lastIdSeen: true as unknown as string,
      }),
    }
    expect(() => parsePagination(dto, parseUserOrdering)).toThrow(InputValidationError)
  })

  it('throws an error if the request has both a cursor and other pagination details', () => {
    const dto: PaginationRequestDto = {
      limit: 10,
      orderBy: 'age',
      orderDirection: OrderDirectionValues.asc,
      cursor: encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: '10',
        lastIdSeen: '1',
      }),
    }
    expect(() => parsePagination(dto, parseUserOrdering)).toThrow(InputValidationError)
  })
})
