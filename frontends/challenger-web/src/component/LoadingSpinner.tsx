import { Container, CircularProgress, styled } from '@mui/material'
import React from 'react'

const LoadingContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0',
})

export const LoadingSpinner = () => {
  return (
    <LoadingContainer>
      <CircularProgress />
    </LoadingContainer>
  )
}
