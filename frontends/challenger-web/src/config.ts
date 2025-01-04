import { required } from '@f1-challenger/errors'

export interface Config {
  coreUrl: string
}

const localConfig: Config = {
  coreUrl: 'http://localhost:3501',
}

const configByHostname: Record<string, Config> = {
  'http://localhost:1234': localConfig,
  // TODO: once deployed to other environments, add them here
}

const getConfig = (): Config => {
  const hostname = `${window.location.protocol}//${window.location.host}`
  return required(configByHostname[hostname], `No config found for hostname ${hostname}`)
}

export const config = getConfig()
