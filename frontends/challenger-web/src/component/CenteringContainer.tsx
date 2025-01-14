import { Container, ContainerProps } from '@mui/material'
import React from 'react'

export type CenteringContainerProps = ContainerProps

export const CenteringContainer = ({ children, sx, ...remainingProps }: CenteringContainerProps) => {
  return (
    <Container
      disableGutters
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...remainingProps}
    >
      {children}
    </Container>
  )
}
