import { initContract } from '@ts-rest/core'
import { leagueContract } from './league'
<<<<<<< Updated upstream
import { teamContract } from './team'
=======
import { leagueMemberContract } from './leagueMember'
import { raceContract } from './race'
import { draftPickContract } from './draftPick'
import { driverContract } from './driver'
import { draftContract } from './draft'
>>>>>>> Stashed changes

const c = initContract()

export const contract = c.router(
  {
    leagues: leagueContract,
<<<<<<< Updated upstream
    teams: teamContract,
=======
    leagueMember: leagueMemberContract,
    race: raceContract,
    draftPick: draftPickContract,
    draft: draftContract,
    driver: driverContract,
>>>>>>> Stashed changes
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/challenger',
  }
)
