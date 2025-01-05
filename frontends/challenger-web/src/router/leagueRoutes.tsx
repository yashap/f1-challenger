import React, { JSX } from 'react'
import { Route } from 'react-router'
import { CreateLeaguePage } from 'src/page/leagues/CreateLeaguePage'
import { LeaguePage } from 'src/page/leagues/LeaguePage'
import { LeaguesPage } from 'src/page/leagues/LeaguesPage'

export const leagueRoutes = (): JSX.Element => {
  return (
    <Route path='leagues'>
      <Route index element={<LeaguesPage />} />
      <Route path='new' element={<CreateLeaguePage />} />
      <Route path=':id' element={<LeaguePage />} />
    </Route>
  )
}
