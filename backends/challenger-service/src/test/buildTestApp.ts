import { NestAppBuilder } from '@f1-challenger/nest-utils'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthModule, SuperTokensExceptionFilter } from 'src/auth'
import { config } from 'src/config'
import { ParkingSpotModule } from 'src/domain/parkingSpot'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [ParkingSpotModule, AuthModule.forRoot(config.auth)],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  app.useGlobalFilters(new SuperTokensExceptionFilter())
  await app.init()
  return app
}
