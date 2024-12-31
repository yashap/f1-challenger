import { Theme } from '@mui/material/styles'

export const getThemeVars = (theme: Theme): Theme => {
  return (theme as unknown as { vars?: Theme }).vars ?? theme
}
