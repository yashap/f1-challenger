import { Inject, Injectable } from '@nestjs/common'
import supertokens from 'supertokens-node'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import { AuthConfigInjectionToken } from 'src/auth/AuthConfigInjectionToken'
import { AuthConfig } from 'src/config'

@Injectable()
export class SuperTokensService {
  constructor(@Inject(AuthConfigInjectionToken) authConfig: AuthConfig) {
    supertokens.init({
      appInfo: authConfig.appInfo,
      supertokens: {
        connectionURI: authConfig.connectionURI,
        apiKey: authConfig.apiKey,
      },
      recipeList: [EmailPassword.init(), Session.init()],
    })
  }
}
