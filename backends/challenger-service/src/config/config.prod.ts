import { config as defaultConfig } from 'src/config/config'
import { Configuration } from 'src/config/Configuration'

export const config: Configuration = {
  ...defaultConfig,
  environment: 'prod',
}
