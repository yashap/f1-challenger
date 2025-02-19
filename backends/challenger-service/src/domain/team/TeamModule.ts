import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/DbModule'
import { TeamController } from 'src/domain/team/TeamController'

@Module({
  controllers: [TeamController],
  imports: [DbModule],
})
export class TeamModule {}
