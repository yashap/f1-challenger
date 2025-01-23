import { Theme } from '@mui/material'
import { CSSProperties } from 'react'

/**
 * TODO:
 * Is there a better way to do this using a custom theme?
 */
export const border = (theme: Theme): Pick<CSSProperties, 'borderRadius' | 'border' | 'borderColor' | 'boxShadow'> => ({
  borderRadius: `${theme.shape.borderRadius}px`,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: theme.shadows[1],
})
