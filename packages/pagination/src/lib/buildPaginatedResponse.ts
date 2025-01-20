import { Cursor, Pagination, encodeCursor } from './Cursor'
import { OrderDirectionValues } from './orderDirection'
import { PaginatedResponseDto, PaginationResponseDto } from './paginationDto'

export const buildPaginatedResponse = <K extends string, T extends Record<K, unknown> & { id: string }>(
  data: T[],
  pagination: Pagination<K, unknown>
): PaginatedResponseDto<T> => {
  let paginationResponse: PaginationResponseDto = {}
  const firstItem = data[0]
  const lastItem = data[data.length - 1]
  const initialOrderDirection =
    (pagination as Partial<Cursor<K, unknown>>).initialOrderDirection ?? pagination.orderDirection
  if (firstItem && lastItem) {
    const baseCursor = { limit: pagination.limit, orderBy: pagination.orderBy, initialOrderDirection }
    const next = {
      ...baseCursor,
      // next/previous refers to the initial order direction - next is always in the initial direction
      orderDirection: initialOrderDirection,
      lastOrderValueSeen: lastItem[pagination.orderBy],
      lastIdSeen: lastItem.id,
    }
    const previous = {
      ...baseCursor,
      // next/previous refers to the initial order direction - previous is always opposite to the initial direction
      orderDirection:
        initialOrderDirection === OrderDirectionValues.asc ? OrderDirectionValues.desc : OrderDirectionValues.asc,
      lastOrderValueSeen: firstItem[pagination.orderBy],
      lastIdSeen: firstItem.id,
    }
    paginationResponse = {
      next: encodeCursor(next),
      previous: encodeCursor(previous),
    }
  }
  return {
    data,
    pagination: paginationResponse,
  }
}
