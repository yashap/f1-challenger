import { MiddlewareConsumer, Module, NestModule, DynamicModule } from '@nestjs/common'
import { AuthConfigInjectionToken } from 'src/auth/AuthConfigInjectionToken'
import { AuthMiddleware } from 'src/auth/AuthMiddleware'
import { SuperTokensService } from 'src/auth/SuperTokensService'
import { AuthConfig } from 'src/config'

@Module({
  providers: [SuperTokensService],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }

  static forRoot({ connectionURI, appInfo, apiKey }: AuthConfig): DynamicModule {
    return {
      providers: [
        {
          provide: AuthConfigInjectionToken,
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
        },
        SuperTokensService,
      ],
      exports: [],
      imports: [],
      module: AuthModule,
    }
  }
}
