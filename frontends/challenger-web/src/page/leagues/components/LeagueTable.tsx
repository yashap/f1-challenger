import { LeagueDto, LeagueStatusValues } from '@f1-challenger/challenger-client'
import { Temporal } from '@js-temporal/polyfill'
import { Container } from '@mui/material'
import { DataGrid, GridColDef, GridPaginationModel, GridSortItem } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { AsyncContent } from 'src/component/AsyncContent'

const columns: GridColDef<LeagueDto>[] = [
  { field: 'name', headerName: 'Name', sortable: false, filterable: false, minWidth: 180 },
  { field: 'description', headerName: 'Description', sortable: false, filterable: false, minWidth: 300 },
  {
    field: 'status',
    headerName: 'Status',
    sortable: false,
    filterable: false,
    minWidth: 130,
    valueGetter: (_value, league) => {
      switch (league.status) {
        case LeagueStatusValues.AcceptingUsers:
          return 'Accepting Users'
        case LeagueStatusValues.Started:
          return 'Started'
      }
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    filterable: false,
    minWidth: 200,
    valueGetter: (_value, league) => {
      const createdInstant = Temporal.Instant.from(league.createdAt)
      return createdInstant.toString()
    },
  },
]

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

export const LeagueTable = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 5 })
  const [sortItem, setSortItem] = useState<GridSortItem>({ field: 'createdAt', sort: 'desc' })
  const [cursor, setCursor] = useState<Cursor>(noCursor)
  const [isPagingBackwards, setIsPagingBackwards] = useState(false)
  const [rowCount, setRowCount] = useState(-1)
  const {
    data: response,
    status,
    error,
  } = useChallengerClient({
    queryKey: ['leagues.listAllPages', paginationModel, sortItem, cursor.current, isPagingBackwards],
    queryFn: async (client) => {
      const leaguesResponse = await client.leagues.listPage({
        ...(cursor.current
          ? { cursor: cursor.current }
          : {
              limit: paginationModel.pageSize,
              orderBy: sortItem.field,
              orderDirection: sortItem.sort ?? 'desc',
            }),
      })
      if (!isPagingBackwards && leaguesResponse.data.length < paginationModel.pageSize) {
        setRowCount(paginationModel.page * paginationModel.pageSize + leaguesResponse.data.length)
      }
      if (leaguesResponse.data.length > 0) {
        setCursor((prevCursor) => ({
          ...prevCursor,
          next: leaguesResponse.pagination.next ?? null,
          previous: leaguesResponse.pagination.previous ?? null,
        }))
      }

      return leaguesResponse
    },
  })
  console.log('>>>', JSON.stringify({ paginationModel, cursor }))

  return (
    <AsyncContent status={status} error={error}>
      {response && (
        <Container disableGutters>
          <DataGrid
            rows={response.data}
            columns={columns}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            paginationMode='server'
            paginationModel={paginationModel}
            onPaginationModelChange={(newPage: GridPaginationModel) => {
              if (newPage.page > paginationModel.page) {
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
                const newOrder = sortItem.sort === 'asc' ? 'desc' : 'asc'
                setSortItem({ ...sortItem, sort: newOrder })
              }
            }}
            rowCount={rowCount}
            sortingOrder={['asc', 'desc']}
          />
        </Container>
      )}
    </AsyncContent>
  )
}
