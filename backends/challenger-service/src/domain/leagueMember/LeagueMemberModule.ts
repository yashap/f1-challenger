import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/DbModule'
import { LeagueMemberController } from 'src/domain/leagueMember/LeagueMemberController'

@Module({
  controllers: [LeagueMemberController],
  imports: [DbModule],
})
export class LeagueMemberModule {}
