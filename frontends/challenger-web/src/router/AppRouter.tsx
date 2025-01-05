import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { buildAuthRoutes } from 'src/auth/buildAuthRoutes'
import { AuthedLayout } from 'src/page/AuthedLayout'
import { leagueRoutes } from 'src/router/leagueRoutes'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {buildAuthRoutes()}
        <Route element={<AuthedLayout />}>{leagueRoutes()}</Route>
        <Route path='*' element={<Navigate to='/leagues' />} />
      </Routes>
    </BrowserRouter>
  )
}
