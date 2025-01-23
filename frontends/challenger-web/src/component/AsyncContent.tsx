import { UseQueryResult } from '@tanstack/react-query'
import React, { JSX } from 'react'
import { ErrorContent } from 'src/component/ErrorContent'
import { LoadingSpinner } from 'src/component/LoadingSpinner'

type Props = Pick<UseQueryResult, 'status' | 'error'> & {
  children: React.ReactNode
}

export const AsyncContent = ({ status, error, children }: Props): JSX.Element => {
  if (status === 'pending') {
    return <LoadingSpinner />
  }
  if (status === 'error') {
    return <ErrorContent error={error ?? 'Something went wrong'} sx={{ pt: 2, pb: 2 }} />
  }

  return <>{children}</>
}
