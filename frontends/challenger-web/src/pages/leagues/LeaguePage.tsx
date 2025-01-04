import { required } from '@f1-challenger/errors'
import React from 'react'
import { useParams } from 'react-router'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { SignOutButton } from 'src/components/SignOutButton'

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
    <div>
      <SignOutButton />
      <h1>League</h1>
      <div>{JSON.stringify(league)}</div>
    </div>
  )
}
