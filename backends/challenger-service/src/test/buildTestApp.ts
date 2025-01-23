import { NestAppBuilder } from '@f1-challenger/nest-utils'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthModule, SuperTokensExceptionFilter } from 'src/auth'
import { config } from 'src/config'
import { LeagueModule } from 'src/domain/league'
import { LeagueMemberModule } from 'src/domain/leagueMember'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [LeagueModule, LeagueMemberModule, AuthModule.forRoot(config.auth)],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  app.useGlobalFilters(new SuperTokensExceptionFilter())
  await app.init()
  return app
}
