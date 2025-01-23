import { Box, Card, CardContent, CardProps, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'
import { border } from 'src/component/border'

export type FieldsProps = CardProps

export const Fields = ({ children, sx, ...remainingProps }: FieldsProps) => {
  const theme = useTheme()
  return (
    <Card {...remainingProps} sx={{ ...sx, ...border(theme) }}>
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {children}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}
