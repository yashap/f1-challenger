import { Box, Card, CardContent, CardProps } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'

type FieldsProps = CardProps

export const Fields = ({ children, ...remainingProps }: FieldsProps) => (
  <Card {...remainingProps}>
    <CardContent>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Box>
    </CardContent>
  </Card>
)
