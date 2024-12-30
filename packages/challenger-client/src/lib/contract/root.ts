import { initContract } from '@ts-rest/core'
import { leagueContract } from './league'

const c = initContract()

export const contract = c.router(
  {
    leagues: leagueContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/challenger',
  }
)
