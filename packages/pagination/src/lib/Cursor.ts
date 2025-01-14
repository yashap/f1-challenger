import { InputValidationError } from '@f1-challenger/errors'
import { Base64 } from 'js-base64'
import { z } from 'zod'
import { DEFAULT_MAX_LIMIT } from './constants'
import { OrderDirection, OrderDirectionSchema } from './orderDirection'

const CursorSchema = z.object({
  limit: z.number().min(1).max(DEFAULT_MAX_LIMIT).describe('Number of items to fetch'),
  orderBy: z.string().describe('Field to order by'),
  orderDirection: OrderDirectionSchema.describe('Order direction'),
  initialOrderDirection: OrderDirectionSchema.describe('The order direction for the first page'),
  lastOrderValueSeen: z.unknown().describe('Last order value seen'),
  lastIdSeen: z.string().describe('Last id seen'),
})

/**
 * Basic pagination fields, used especially for fetching the first page
 */
export interface InitialPagination<K extends string> {
  limit: number
  orderBy: K
  orderDirection: OrderDirection
}

/**
 * Information encoded within a cursor - basic pagination fields, plus information about the last record seen
 */
export interface Cursor<K extends string, V> extends InitialPagination<K> {
  initialOrderDirection: OrderDirection
  lastOrderValueSeen: V
  lastIdSeen: string
}

/**
 * Either the pagination fields to fetch the initial page, or a parsed cursor to fetch a subsequent page
 */
export type Pagination<K extends string, V> = InitialPagination<K> | Cursor<K, V>

/**
 * If you have a Cursor type, and you want to turn it into a Pagination type, you can just:
 *
 * type UserPagination = AsPagination<UserCursor>
 */
export type AsPagination<C extends Cursor<K, V>, K extends string = string, V = unknown> =
  | C
  | Omit<C, 'initialOrderDirection' | 'lastOrderValueSeen' | 'lastIdSeen'>

/**
 * A function that can parse (both validate and transform) the ordering fields of a cursor
 */
export type ParseOrdering<K extends string, V> = (ordering: { orderBy: unknown; lastOrderValueSeen: unknown }) => {
  orderBy: K
  lastOrderValueSeen: V
}

/**
 * Parse a cursor, both validating it and parsing the ordering fields
 */
const parseCursor = <K extends string, V>(cursor: unknown, parseOrdering: ParseOrdering<K, V>): Cursor<K, V> => {
  const { orderBy, lastOrderValueSeen, ...parsedCursor } = CursorSchema.parse(cursor)
  return {
    ...parsedCursor,
    ...parseOrdering({ orderBy, lastOrderValueSeen }),
  }
}

export const encodeCursor = <K extends string, V>(cursor: Cursor<K, V>): string => {
  return Base64.encode(JSON.stringify(cursor))
}

export const decodeCursor = <K extends string, V>(cursor: string, parseOrdering: ParseOrdering<K, V>): Cursor<K, V> => {
  try {
    const cursorObject: unknown = JSON.parse(Base64.decode(cursor))
    return parseCursor(cursorObject, parseOrdering)
  } catch (error) {
    throw new InputValidationError('Invalid cursor', { cause: error })
  }
}
