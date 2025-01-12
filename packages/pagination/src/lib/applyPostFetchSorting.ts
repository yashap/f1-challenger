import { Cursor, Pagination } from './Cursor'

export const applyPostFetchSorting = <T, K extends string, V>(data: T[], pagination: Pagination<K> | Cursor<K, V>) => {
  const reverseAfterFetch = (pagination as Partial<Cursor<K, V>>).reverseAfterFetch ?? false
  if (reverseAfterFetch) {
    return [...data].reverse()
  }
  return data
}
