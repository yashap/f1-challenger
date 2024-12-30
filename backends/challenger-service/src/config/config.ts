import { Configuration } from 'src/config/Configuration'

const port = Number(process.env['PORT'] ?? 3501)
const hostName: string = process.env['HOST_NAME'] ?? 'http://localhost'

export const config: Configuration = {
  environment: 'dev',
  port,
  auth: {
    appInfo: {
      appName: 'F1Challenger',
      apiDomain: `${hostName}:${port}`,
      // TODO: have to provide websiteDomain or origin ... look into what this is
      websiteDomain: 'http://localhost:3000',
    },
    connectionURI: process.env['SUPERTOKENS_CORE_URL'] ?? 'http://localhost:3567',
  },
}
