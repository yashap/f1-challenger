import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { alpha, styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import React from 'react'
import { Link } from 'react-router'
import { ChallengerLogo } from 'src/component/ChallengerLogo'
import { SignOutButton } from 'src/component/SignOutButton'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
  margin: '10px 0 18px 0',
}))

const LogoContainer = styled('div')(() => ({
  marginRight: '10px',
}))

const Logo = () => (
  <Link to='/leagues'>
    <LogoContainer>
      <ChallengerLogo sx={{ marginTop: '-4px' }} />
    </LogoContainer>
  </Link>
)

export const MainNavBar = () => {
  return (
    <AppBar
      position='relative'
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
      }}
    >
      <StyledToolbar variant='dense' disableGutters>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
          <Logo />
          <Box sx={{ display: 'flex' }}>
            <Link to='/leagues'>
              <Button variant='text' color='info' size='small'>
                Home
              </Button>
            </Link>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <SignOutButton />
        </Box>
      </StyledToolbar>
    </AppBar>
  )
}
