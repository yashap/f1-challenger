import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'
import * as React from 'react'
import { dataDisplayCustomizations } from 'src/theme/customizations/dataDisplay'
import { feedbackCustomizations } from 'src/theme/customizations/feedback'
import { inputsCustomizations } from 'src/theme/customizations/inputs'
import { navigationCustomizations } from 'src/theme/customizations/navigation'
import { surfacesCustomizations } from 'src/theme/customizations/surfaces'
import { colorSchemes, typography, shadows, shape } from 'src/theme/themePrimitives'

interface AppThemeProps {
  children: React.ReactNode
  themeComponents?: ThemeOptions['components']
}

export const AppTheme = (props: AppThemeProps) => {
  const { children, themeComponents } = props
  //const { mode } = useColorScheme()
  const theme = React.useMemo(() => {
    return createTheme({
      // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
      cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
        cssVarPrefix: 'template',
      },
      colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        ...themeComponents,
      },
    })
  }, [themeComponents])
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
