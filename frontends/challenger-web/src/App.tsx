import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'src/App.css'
import { SuperTokensWrapper } from 'supertokens-auth-react'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { buildAuthRoutes } from 'src/auth/buildAuthRoutes'
import { initAuth } from 'src/auth/initAuth'
import { LeaguesPage } from 'src/pages/LeaguesPage'

initAuth()

export const App = () => {
  return (
    <SuperTokensWrapper>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Routes>
          {buildAuthRoutes()}
          <Route
            path='leagues'
            element={
              <SessionAuth>
                <LeaguesPage />
              </SessionAuth>
            }
          />
          <Route path='*' element={<Navigate to='/leagues' />} />
        </Routes>
      </BrowserRouter>
    </SuperTokensWrapper>
  )
}
