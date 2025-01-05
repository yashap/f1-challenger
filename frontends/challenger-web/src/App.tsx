import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'src/App.css'
import { SuperTokensWrapper } from 'supertokens-auth-react'
import { initAuth } from 'src/auth/initAuth'
import { AppRouter } from 'src/router/AppRouter'

initAuth()

const queryClient = new QueryClient()

export const App = () => {
  return (
    <React.StrictMode>
      <SuperTokensWrapper>
        <QueryClientProvider client={queryClient}>
          <CssBaseline enableColorScheme />
          <AppRouter />
        </QueryClientProvider>
      </SuperTokensWrapper>
    </React.StrictMode>
  )
}
