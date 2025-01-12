import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { AsyncContent } from 'src/component/AsyncContent'
import { Page } from 'src/component/Page'
import { LeagueTable } from 'src/page/leagues/components/LeagueTable'

export const LeaguesPage = () => {
  const {
    data: leagues,
    status,
    error,
  } = useChallengerClient({
    queryKey: ['leagues.listAllPages'],
    queryFn: (client) => client.leagues.listAllPages({}),
  })

  return (
    <Page>
      <Typography variant='h4'>Leagues</Typography>
      <AsyncContent status={status} error={error}>
        {leagues && <LeagueTable leagues={leagues} />}
      </AsyncContent>
      <Link to='/leagues/new'>
        <Button variant='contained' color='primary' type='submit'>
          Create League
        </Button>
      </Link>
    </Page>
  )
}
