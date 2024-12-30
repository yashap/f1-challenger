import { initContract } from '@ts-rest/core'
import { leagueContract } from './league'
import { leagueMembersContract } from './leagueMembers'

const c = initContract()

export const contract = c.router(
  {
    leagues: leagueContract,
    leagueMembers: leagueMembersContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/challenger',
  }
)
