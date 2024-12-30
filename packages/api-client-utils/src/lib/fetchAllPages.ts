import { PaginatedResponseDto, PaginationRequestDto } from '@f1-challenger/pagination'
import { omit } from 'lodash'

export const fetchAllPages = async <T, R extends PaginationRequestDto>(
  request: Omit<R, 'limit'> & { limit: number },
  fetchPage: (request: R) => Promise<PaginatedResponseDto<T>>
): Promise<T[]> => {
  const limit = request.limit
  const firstPageResponse = await fetchPage(request as R)
  const allData = [...firstPageResponse.data]
  let prevPageResponse = firstPageResponse
  while (prevPageResponse.pagination.next && prevPageResponse.data.length >= limit) {
    const nextPageResponse = await fetchPage({
      ...omit(request, ['limit', 'orderBy', 'orderDirection']),
      cursor: prevPageResponse.pagination.next,
    } as R)
    allData.push(...nextPageResponse.data)
    prevPageResponse = nextPageResponse
  }
  return allData
}
