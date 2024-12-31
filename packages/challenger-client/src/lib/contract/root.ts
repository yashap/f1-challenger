import { initContract } from '@ts-rest/core'
import { leagueContract } from './league'
import { leagueMemberContract } from './leagueMember'

const c = initContract()

export const contract = c.router(
  {
    leagues: leagueContract,
    leagueMember: leagueMemberContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/challenger',
  }
)
