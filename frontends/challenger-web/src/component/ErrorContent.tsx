import { useTheme } from '@mui/material'
import { isString } from 'lodash'
import React from 'react'
import { CenteringContainer, CenteringContainerProps } from 'src/component/CenteringContainer'

type Props = Omit<CenteringContainerProps, 'children'> & {
  error: Error | string
}

export const ErrorContent = ({ error, sx, ...remainingProps }: Props) => {
  const theme = useTheme()
  const errorMessage = (isString(error) ? error : error.message) || 'Unexpected error'
  return (
    <CenteringContainer
      sx={{
        backgroundColor: 'rgb(239, 83, 80, 0.1)',
        color: theme.palette.error.dark,
        ...sx,
      }}
      {...remainingProps}
    >
      {errorMessage}
    </CenteringContainer>
  )
}
