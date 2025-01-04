import { ChallengerClient } from '@f1-challenger/challenger-client'
import { config } from 'src/config'

export class ChallengerClientBuilder {
  public static build() {
    return ChallengerClient.build({ baseURL: config.coreUrl })
  }
}
