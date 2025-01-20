import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'

export interface FieldProps {
  label: React.ReactNode
  value: React.ReactNode

  /**
   * A number between 1 and 11, representing how many columns of a 12 column grid the label should take up. The value
   * will take up the remaining columns.
   *
   * Default 3.
   */
  labelSize?: number
}

export const Field = ({ label, value, labelSize = 3 }: FieldProps) => {
  if (labelSize < 1 || labelSize > 11) {
    throw new Error('labelSize must be between 1 and 11')
  }
  const valueSize = 12 - labelSize
  return (
    <>
      <Grid size={labelSize}>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Grid>
      <Grid size={valueSize}>
        <Typography variant='body1'>{value}</Typography>
      </Grid>
    </>
  )
}
