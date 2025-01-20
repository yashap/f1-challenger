import React from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { signOut } from 'supertokens-web-js/recipe/session'
import { Button } from 'src/component/Button'

const onSignOutClicked = async (navigate: NavigateFunction) => {
  await signOut()
  await navigate('/auth')
}

export const SignOutButton = () => {
  const navigate = useNavigate()
  return (
    <Button
      onClick={() => {
        void onSignOutClicked(navigate)
      }}
    >
      Sign Out
    </Button>
  )
}
