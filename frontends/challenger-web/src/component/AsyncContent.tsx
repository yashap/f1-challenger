import { Container } from '@mui/material'
import { UseQueryResult } from '@tanstack/react-query'
import React, { JSX } from 'react'
import { LoadingSpinner } from 'src/component/LoadingSpinner'

type Props = Pick<UseQueryResult, 'status' | 'error'> & {
  children: React.ReactNode
}

export const AsyncContent = ({ status, error, children }: Props): JSX.Element => {
  if (status === 'pending') {
    return <LoadingSpinner />
  }
  if (status === 'error') {
    return <Container>{error?.message ?? 'Something went wrong'}</Container>
  }

  return <>{children}</>
}
