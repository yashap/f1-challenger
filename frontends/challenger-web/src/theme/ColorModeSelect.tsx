import MenuItem from '@mui/material/MenuItem'
import Select, { SelectProps } from '@mui/material/Select'
import { useColorScheme } from '@mui/material/styles'
import * as React from 'react'

/**
 * If we ever want to expose setting of light/dark mode, we can use this component.
 */
export const ColorModeSelect = (props: SelectProps) => {
  const { mode, setMode } = useColorScheme()
  if (!mode) {
    return null
  }
  return (
    <Select
      value={mode}
      onChange={(event) => {
        setMode(event.target.value as 'system' | 'light' | 'dark')
      }}
      SelectDisplayProps={{
        // @ts-expect-error Workaround for too strict typing
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value='system'>System</MenuItem>
      <MenuItem value='light'>Light</MenuItem>
      <MenuItem value='dark'>Dark</MenuItem>
    </Select>
  )
}
