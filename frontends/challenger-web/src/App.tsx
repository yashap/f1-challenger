import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import * as reactRouter from 'react-router'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'src/App.css'
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui'
import Session, { SessionAuth } from 'supertokens-auth-react/recipe/session'
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui'
import SignIn from 'src/pages/SignIn'
import { AppTheme } from 'src/theme/AppTheme'

SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
    appName: 'F1Challenger',
    apiDomain: 'http://localhost:3501',
    websiteDomain: 'http://localhost:1234',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [EmailPassword.init(), Session.init()],
})

const StubApp2 = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <a>Some other route</a>
      </header>
    </div>
  )
}

export const App = () => {
  return (
    <SuperTokensWrapper>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <BrowserRouter>
          <Routes>
            {getSuperTokensRoutesForReactRouterDom(reactRouter, [EmailPasswordPreBuiltUI])}
            <Route path='signIn' element={<SignIn />} />
            <Route path='foo' element={<SessionAuth><StubApp2 /></SessionAuth>} />
            <Route path="*" element={<Navigate to="/foo" />} />
          </Routes>
        </BrowserRouter>
      </AppTheme>
    </SuperTokensWrapper>
  )
}
