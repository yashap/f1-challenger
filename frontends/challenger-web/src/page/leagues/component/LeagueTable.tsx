import { LeagueDto, LeagueStatusValues } from '@f1-challenger/challenger-client'
import { Temporal } from '@js-temporal/polyfill'
import { GridColDef } from '@mui/x-data-grid'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ChallengerClientBuilder } from 'src/apiClient/ChallengerClientBuilder'
import { PaginatedTable } from 'src/component/PaginatedTable'

const columns: GridColDef<LeagueDto>[] = [
  { field: 'name', headerName: 'Name', minWidth: 180 },
  { field: 'description', headerName: 'Description', minWidth: 300 },
  {
    field: 'status',
    headerName: 'Status',
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
    sortable: true,
    minWidth: 200,
    valueGetter: (_value, league) => {
      const createdInstant = Temporal.Instant.from(league.createdAt)
      return createdInstant.toString()
    },
  },
]

export const LeagueTable = () => {
  const client = useMemo(() => ChallengerClientBuilder.build(), [])
  const navigate = useNavigate()
  return (
    <PaginatedTable
      columns={columns}
      queryKey={['leagues.listPage', client]}
      fetchPage={(queryParams) => client.leagues.listPage(queryParams)}
      pageSizes={[5, 10, 20]}
      onRowClick={(league) => {
        void navigate(`/leagues/${league.id}`)
      }}
    />
  )
}
