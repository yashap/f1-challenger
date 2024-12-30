import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/DbModule'
import { LeagueController } from 'src/domain/league/LeagueController'

@Module({
  controllers: [LeagueController],
  imports: [DbModule],
})
export class LeagueModule {}
