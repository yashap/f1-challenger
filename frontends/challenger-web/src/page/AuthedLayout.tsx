import React from 'react'
import { Outlet } from 'react-router'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'

export const AuthedLayout = () => {
  return (
    <SessionAuth>
      <Outlet />
    </SessionAuth>
  )
}
