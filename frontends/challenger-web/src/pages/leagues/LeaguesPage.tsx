import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { SignOutButton } from 'src/components/SignOutButton'

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
    <div>
      <SignOutButton />
      <h1>Leagues</h1>
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
    </div>
  )
}
