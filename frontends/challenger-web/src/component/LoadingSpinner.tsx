import { CircularProgress } from '@mui/material'
import React from 'react'
import { CenteringContainer } from 'src/component/CenteringContainer'

export const LoadingSpinner = () => {
  return (
    <CenteringContainer>
      <CircularProgress />
    </CenteringContainer>
  )
}
