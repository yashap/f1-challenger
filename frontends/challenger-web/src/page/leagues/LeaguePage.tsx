import { required } from '@f1-challenger/errors'
import { Typography } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router'
import { useChallengerClient } from 'src/apiClient/useChallengerClient'
import { AsyncContent } from 'src/component/AsyncContent'
import { Field, Fields } from 'src/component/Field'
import { Page } from 'src/component/Page'
import { TeamTable } from 'src/page/leagues/component/TeamTable'

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

  return (
    <Page>
      <AsyncContent status={status} error={error}>
        {league && (
          <>
            <Typography variant='h4'>{league.name}</Typography>
            {league.description && (
              <Typography
                variant='subtitle1'
                sx={{
                  color: 'text.secondary',
                }}
              >
                {league.description}
              </Typography>
            )}

            <Fields sx={{ mt: 1, mb: 1 }}>
              <Field label='Administrator' value={league.adminUserId} />
              <Field label='Created' value={league.createdAt} />
              <Field label='Status' value={league.status} />
            </Fields>
          </>
        )}
      </AsyncContent>

      <Typography variant='h4' sx={{ mt: 3 }}>
        Teams
      </Typography>
      <TeamTable leagueId={id} sx={{ mt: 1, mb: 1 }} />
    </Page>
  )
}
