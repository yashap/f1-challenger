import { Cursor, Pagination, encodeCursor } from './Cursor'
import { OrderDirectionValues } from './orderDirection'
import { PaginatedResponseDto, PaginationResponseDto } from './paginationDto'

export const buildPaginatedResponse = <K extends string, T extends Record<K, unknown> & { id: string }>(
  data: T[],
  pagination: Pagination<K> | Cursor<K, unknown>
): PaginatedResponseDto<T> => {
  let paginationResponse: PaginationResponseDto = {}
  const firstItem = data[0]
  const lastItem = data[data.length - 1]
  const lastRequestReverseAfterFetch = (pagination as Partial<Cursor<K, unknown>>).reverseAfterFetch ?? false
  if (firstItem && lastItem) {
    const baseCursor = { limit: pagination.limit, orderBy: pagination.orderBy }
    const lastItemForNext = lastRequestReverseAfterFetch ? firstItem : lastItem
    const lastItemForPrevious = lastRequestReverseAfterFetch ? lastItem : firstItem
    const next = {
      ...baseCursor,
      orderDirection: pagination.orderDirection,
      reverseAfterFetch: lastRequestReverseAfterFetch,
      lastOrderValueSeen: lastItemForNext[pagination.orderBy],
      lastIdSeen: lastItemForNext.id,
    }
    const previous = {
      ...baseCursor,
      orderDirection:
        pagination.orderDirection === OrderDirectionValues.asc ? OrderDirectionValues.desc : OrderDirectionValues.asc,
      reverseAfterFetch: !lastRequestReverseAfterFetch,
      lastOrderValueSeen: lastItemForPrevious[pagination.orderBy],
      lastIdSeen: lastItemForPrevious.id,
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
