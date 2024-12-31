import React from 'react'
import { Route, RouteProps } from 'react-router'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'

type Props = RouteProps & Required<Pick<RouteProps, 'element'>>

export const AuthedRoute = ({ element, ...props }: Props) => {
  return <Route element={<SessionAuth>{element}</SessionAuth>} {...props} />
}
