import { Inject, Injectable } from '@nestjs/common'
import supertokens from 'supertokens-node'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import ThirdParty from 'supertokens-node/recipe/thirdparty'
import { AuthConfigInjectionToken } from 'src/auth/AuthConfigInjectionToken'
import { AuthConfig, config } from 'src/config'

@Injectable()
export class SuperTokensService {
  constructor(@Inject(AuthConfigInjectionToken) authConfig: AuthConfig) {
    supertokens.init({
      appInfo: authConfig.appInfo,
      supertokens: {
        connectionURI: authConfig.connectionURI,
        apiKey: authConfig.apiKey,
      },
      recipeList: [
        ThirdParty.init({
          signInAndUpFeature: {
            providers: [{ config: config.socialSignIn.google }, { config: config.socialSignIn.apple }],
          },
        }),
        EmailPassword.init(),
        Session.init(),
      ],
    })
  }
}
