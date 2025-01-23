import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'
import { Button } from 'src/component/Button'
import { Page } from 'src/component/Page'
import { LeagueTable } from 'src/page/leagues/component/LeagueTable'

export const LeaguesPage = () => (
  <Page>
    <Typography variant='h4'>Leagues</Typography>
    <LeagueTable sx={{ mt: 1, mb: 1 }} />
    <Link to='/leagues/new'>
      <Button type='submit'>Create League</Button>
    </Link>
  </Page>
)
