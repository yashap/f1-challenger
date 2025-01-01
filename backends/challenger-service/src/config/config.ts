import { Configuration } from 'src/config/Configuration'

const port = Number(process.env['PORT'] ?? 3501)
const hostName: string = process.env['HOST_NAME'] ?? 'http://localhost'

export const config: Configuration = {
  environment: 'dev',
  port,
  auth: {
    appInfo: {
      appName: 'F1 Challenger',
      apiDomain: `${hostName}:${port}`,
      websiteDomain: 'http://localhost:1234',
    },
    connectionURI: process.env['SUPERTOKENS_CORE_URL'] ?? 'http://localhost:3567',
  },
  /**
   * TODO: IMPORTANT! These are just development/testing keys provided by Supertokens. Must replace them with
   * own OAuth keys for production use.
   *
   * Details: https://supertokens.com/docs/thirdpartyemailpassword/quickstart/backend-setup
   */
  socialSignIn: {
    google: {
      thirdPartyId: 'google',
      clients: [
        {
          clientId: '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
          clientSecret: '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',
        },
      ],
    },
    apple: {
      thirdPartyId: 'apple',
      clients: [
        {
          clientId: '4398792-io.supertokens.example.service',
          additionalConfig: {
            keyId: '7M48Y4RYDL',
            privateKey:
              '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
            teamId: 'YWQCXGJRJL',
          },
        },
      ],
    },
  },
}
