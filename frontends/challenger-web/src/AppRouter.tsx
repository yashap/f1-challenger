import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { buildAuthRoutes } from 'src/auth/buildAuthRoutes'
import { CreateLeaguePage } from 'src/pages/leagues/CreateLeaguePage'
import { LeaguePage } from 'src/pages/leagues/LeaguePage'
import { LeaguesPage } from 'src/pages/leagues/LeaguesPage'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {buildAuthRoutes()}
        <Route path='leagues'>
          <Route
            index
            element={
              <SessionAuth>
                <LeaguesPage />
              </SessionAuth>
            }
          />
          <Route
            path='new'
            element={
              <SessionAuth>
                <CreateLeaguePage />
              </SessionAuth>
            }
          />
          <Route
            path=':id'
            element={
              <SessionAuth>
                <LeaguePage />
              </SessionAuth>
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='/leagues' />} />
      </Routes>
    </BrowserRouter>
  )
}
