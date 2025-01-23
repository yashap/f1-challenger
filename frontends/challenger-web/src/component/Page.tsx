import { Container } from '@mui/material'
import React from 'react'
import { MainNavBar } from 'src/component/MainNavBar'

interface PageProps {
  children: React.ReactNode
}

export const Page = ({ children }: PageProps) => {
  return (
    <Container maxWidth='lg'>
      <MainNavBar />
      {children}
    </Container>
  )
}
