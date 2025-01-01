import { AppInfo } from 'supertokens-node/types'

export const ConfigInjectionToken = 'ConfigInjectionToken'

export interface AuthConfig {
  appInfo: AppInfo
  connectionURI: string
  apiKey?: string
}

export interface Configuration {
  environment: 'dev' | 'prod'
  port: number
  auth: AuthConfig
  socialSignIn: {
    google: {
      thirdPartyId: 'google'
      clients: [
        {
          clientId: string
          clientSecret: string
        },
      ]
    }
    apple: {
      thirdPartyId: 'apple'
      clients: [
        {
          clientId: string
          additionalConfig: {
            keyId: string
            privateKey: string
            teamId: string
          }
        },
      ]
    }
  }
}
