import { required } from '@f1-challenger/errors'
import { Typography } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { Page } from 'src/component/Page'

export const LeaguePage = () => {
  const { id } = useParams<{ id: string }>()
  const {
    data: league,
    status,
    error,
  } = useChallengerClient({
    queryKey: ['leagues.get', id],
    queryFn: (client) => client.leagues.get(required(id)),
  })

  if (status === 'pending') {
    return <div>Loading...</div>
  }
  if (status === 'error') {
    return <div>Error: {error.message}</div>
  }
  return (
    <Page>
      <Typography variant='h4'>League</Typography>
      <div>{JSON.stringify(league)}</div>
    </Page>
  )
}
