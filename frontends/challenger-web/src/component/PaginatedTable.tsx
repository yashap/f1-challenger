import { required } from '@f1-challenger/errors'
import {
  OrderDirection,
  OrderDirectionValues,
  PaginatedResponseDto,
  PaginationRequestDto,
} from '@f1-challenger/pagination'
import { Container } from '@mui/material'
import { DataGrid, GridColDef, GridPaginationModel, GridSortItem, GridValidRowModel } from '@mui/x-data-grid'
import { QueryKey, useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { CenteringContainer } from 'src/component/CenteringContainer'
import { ErrorContent } from 'src/component/ErrorContent'

const columnDefaults: Partial<GridColDef> = { sortable: false, filterable: false }

interface Ordering {
  field: string
  sort: OrderDirection
}

interface Cursor {
  current: string | null
  previous: string | null
  next: string | null
}

const noCursor: Cursor = {
  current: null,
  previous: null,
  next: null,
}

const defaultInitialOrdering: Ordering = {
  field: 'createdAt',
  sort: OrderDirectionValues.desc,
}

const defaultPageSizes = [5, 10] as const

interface Props<T extends GridValidRowModel, Q extends PaginationRequestDto> {
  columns: GridColDef<T>[]
  queryKey: QueryKey
  fetchPage: (queryParams: Q) => Promise<PaginatedResponseDto<T>>
  initialOrdering?: Ordering
  initalPageSize?: number
  pageSizes?: readonly number[]
  // TODO: support default filter
}

export const PaginatedTable = <T extends GridValidRowModel, Q extends PaginationRequestDto>({
  columns,
  queryKey,
  fetchPage,
  initalPageSize,
  initialOrdering = defaultInitialOrdering,
  pageSizes = defaultPageSizes,
}: Props<T, Q>) => {
  const columnsWithDefaults = useMemo(() => columns.map((column) => ({ ...columnDefaults, ...column })), [columns])
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: initalPageSize ?? required(pageSizes[0]),
  })
  const [sortItem, setSortItem] = useState<GridSortItem>(initialOrdering)
  const [cursor, setCursor] = useState<Cursor>(noCursor)
  const [isPagingBackwards, setIsPagingBackwards] = useState(false)
  const [rowCount, setRowCount] = useState(-1)
  const {
    data: response,
    status,
    error,
  } = useQuery({
    queryKey: [...queryKey, paginationModel, sortItem, cursor.current, isPagingBackwards],
    queryFn: async () => {
      const paginationParams: PaginationRequestDto = cursor.current
        ? { cursor: cursor.current }
        : {
            limit: paginationModel.pageSize,
            orderBy: sortItem.field,
            orderDirection: sortItem.sort ?? OrderDirectionValues.desc,
          }
      // TODO: support filtering!
      const queryParams: Q = paginationParams as Q
      const paginatedResponse = await fetchPage(queryParams)
      if (!isPagingBackwards && paginatedResponse.data.length < paginationModel.pageSize) {
        setRowCount(paginationModel.page * paginationModel.pageSize + paginatedResponse.data.length)
      }
      if (paginatedResponse.data.length > 0) {
        setCursor((prevCursor) => ({
          ...prevCursor,
          next: paginatedResponse.pagination.next ?? null,
          previous: paginatedResponse.pagination.previous ?? null,
        }))
      }

      return paginatedResponse
    },
  })

  return (
    <Container disableGutters>
      <DataGrid
        loading={status === 'pending'}
        rows={status === 'success' ? (response.data as unknown as T[]) : []}
        slots={{
          noRowsOverlay: () => {
            return status === 'error' ? (
              <ErrorContent error={`Failed to load: ${error.message}`} />
            ) : (
              <CenteringContainer>No rows</CenteringContainer>
            )
          },
        }}
        columns={columnsWithDefaults}
        pageSizeOptions={pageSizes}
        sx={{ border: 0 }}
        paginationMode='server'
        paginationModel={paginationModel}
        onPaginationModelChange={(newPage: GridPaginationModel) => {
          if (newPage.pageSize !== paginationModel.pageSize) {
            setIsPagingBackwards(false)
            setCursor(noCursor)
            if (newPage.page !== 0) {
              setPaginationModel({ ...newPage, page: 0 })
            }
          } else if (newPage.page > paginationModel.page) {
            setIsPagingBackwards(false)
            setCursor({ ...cursor, current: cursor.next })
          } else if (newPage.page < paginationModel.page) {
            setIsPagingBackwards(true)
            setCursor({ ...cursor, current: cursor.previous })
          }

          setPaginationModel(newPage)
        }}
        sortingMode='server'
        sortModel={[sortItem]}
        onSortModelChange={(model) => {
          setCursor(noCursor)
          const item = model[0]
          if (item) {
            setSortItem(item)
          } else {
            const newOrder =
              sortItem.sort === OrderDirectionValues.asc ? OrderDirectionValues.desc : OrderDirectionValues.asc
            setSortItem({ ...sortItem, sort: newOrder })
          }
        }}
        rowCount={rowCount}
        sortingOrder={[OrderDirectionValues.asc, OrderDirectionValues.desc]}
      />
    </Container>
  )
}
