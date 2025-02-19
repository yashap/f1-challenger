import { initContract } from '@ts-rest/core'
import { leagueContract } from './league'
import { teamContract } from './team'

const c = initContract()

export const contract = c.router(
  {
    leagues: leagueContract,
    teams: teamContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/challenger',
  }
)
