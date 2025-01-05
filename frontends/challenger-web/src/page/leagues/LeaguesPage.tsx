import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { Page } from 'src/component/Page'

export const LeaguesPage = () => {
  const {
    data: leagues,
    status,
    error,
  } = useChallengerClient({
    queryKey: ['leagues.listAllPages'],
    queryFn: (client) => client.leagues.listAllPages({}),
  })

  if (status === 'pending') {
    return <div>Loading...</div>
  }
  if (status === 'error') {
    return <div>Error: {error.message}</div>
  }
  return (
    <Page>
      <Typography variant='h4'>Leagues</Typography>
      <ul>
        {leagues.map((league) => (
          <li key={league.id}>{JSON.stringify(league)}</li>
        ))}
      </ul>
      <Link to='/leagues/new'>
        <Button variant='contained' color='primary' type='submit'>
          Create League
        </Button>
      </Link>
    </Page>
  )
}
