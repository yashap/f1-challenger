import { InputValidationError } from '@f1-challenger/errors'
import { z } from 'zod'
import { DEFAULT_MAX_LIMIT } from './constants'
import { Cursor, decodeCursor, encodeCursor } from './Cursor'
import { OrderDirectionValues } from './orderDirection'

describe('Cursor', () => {
  type UserCursor = Cursor<'age' | 'name', number | string>
  const OrderingSchema = z.union([
    z.object({
      orderBy: z.literal('age'),
      lastOrderValueSeen: z.number(),
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

  describe(encodeCursor.name, () => {
    it('encodes a cursor', () => {
      const cursor: UserCursor = {
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      }
      const encodedCursor = encodeCursor(cursor)
      expect(encodedCursor).toBeDefined()
      const isString = typeof encodedCursor === 'string' || encodeCursor instanceof String
      expect(isString).toBe(true)
      expect(encodedCursor.length).toBeGreaterThan(0)
    })
  })

  describe(decodeCursor.name, () => {
    it('decodes a cursor', () => {
      const cursor: UserCursor = {
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.desc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      }
      const encodedCursor = encodeCursor(cursor)
      const decodedCursor = decodeCursor(encodedCursor, parseUserOrdering)
      expect(decodedCursor).toEqual(cursor)
    })

    it('decodes a cursor, with descending order', () => {
      const cursor: UserCursor = {
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.desc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      }
      const encodedCursor = encodeCursor(cursor)
      const decodedCursor = decodeCursor(encodedCursor, parseUserOrdering)
      expect(decodedCursor).toEqual(cursor)
    })

    it('throws an error if the cursor has a limit field with the wrong type', () => {
      const cursor = encodeCursor({
        limit: '11',
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.desc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a missing limit field', () => {
      const cursor = encodeCursor({
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a too low limit field', () => {
      const cursor = encodeCursor({
        limit: 0,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a too high limit field', () => {
      const cursor = encodeCursor({
        limit: DEFAULT_MAX_LIMIT + 1,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has an orderBy field with the wrong type', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'foo',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a missing orderBy field', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has an orderDirection field with the wrong type', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: 'foo',
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a missing orderDirection field', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has an initialOrderDirection field with the wrong type', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: 'foo',
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a missing reverseAfterFetch field', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a lastOrderValueSeen field with the wrong type', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: '10',
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a missing lastOrderValueSeen field', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastIdSeen: '123',
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a lastIdSeen field with the wrong type', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
        lastIdSeen: 123,
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })

    it('throws an error if the cursor has a missing lastIdSeen field', () => {
      const cursor = encodeCursor({
        limit: 10,
        orderBy: 'age',
        orderDirection: OrderDirectionValues.asc,
        initialOrderDirection: OrderDirectionValues.asc,
        lastOrderValueSeen: 10,
      } as unknown as UserCursor)
      expect(() => decodeCursor(cursor, parseUserOrdering)).toThrow(InputValidationError)
    })
  })
})
