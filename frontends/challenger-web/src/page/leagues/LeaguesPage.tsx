import { Button, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router'
import { Page } from 'src/component/Page'
import { LeagueTable } from 'src/page/leagues/components/LeagueTable'

export const LeaguesPage = () => (
  <Page>
    <Typography variant='h4'>Leagues</Typography>
    <LeagueTable />
    <Link to='/leagues/new'>
      <Button variant='contained' color='primary' type='submit'>
        Create League
      </Button>
    </Link>
  </Page>
)
