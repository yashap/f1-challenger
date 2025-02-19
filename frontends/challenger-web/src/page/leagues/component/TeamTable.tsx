import { TeamDto } from '@f1-challenger/challenger-client'
import { SxProps, Theme } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ChallengerClientBuilder } from 'src/apiClient/ChallengerClientBuilder'
import { PaginatedTable } from 'src/component/PaginatedTable'

const columns: GridColDef<TeamDto>[] = [{ field: 'userId', headerName: 'Owner', minWidth: 300 }]

interface Props {
  leagueId?: string
  userId?: string
  sx?: SxProps<Theme>
}

export const TeamTable = ({ leagueId, userId, sx }: Props) => {
  const client = useMemo(() => ChallengerClientBuilder.build(), [])
  const navigate = useNavigate()
  return (
    <PaginatedTable
      columns={columns}
      queryKey={['teams.listPage', client]}
      fetchPage={(queryParams) => client.teams.listPage({ ...queryParams, leagueId, userId })}
      pageSizes={[5, 10, 20]}
      onRowClick={(team) => {
        void navigate(`/teams/${team.id}`)
      }}
      sx={sx}
    />
  )
}
