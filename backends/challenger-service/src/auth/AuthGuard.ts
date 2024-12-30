import { TestOnly } from '@f1-challenger/test-utils'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Response } from 'express'
import { Error as SuperTokensError } from 'supertokens-node'
import { SessionRequest } from 'supertokens-node/framework/express'
import { SessionContainer, VerifySessionOptions } from 'supertokens-node/recipe/session'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'

interface TestAuthData {
  userId: string
}

@Injectable()
export class AuthGuard implements CanActivate {
  private static isMocked = false

  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp()

    if (AuthGuard.isMocked) {
      AuthGuard.addTestSession(ctx)
      return true
    }

    let err = undefined
    const resp = ctx.getResponse<Response>()

    // verifySession mutates the response object if the session is invalid (e.g. no token, stale token, etc.)
    await verifySession(this.verifyOptions)(ctx.getRequest(), resp, (res) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      err = res
    })

    if (resp.headersSent) {
      throw new SuperTokensError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT',
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (err) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw err
    }

    return true
  }

  @TestOnly
  public static mock(): void {
    this.isMocked = true
  }

  @TestOnly
  public static unMock(): void {
    this.isMocked = false
  }

  @TestOnly
  public static buildTestAuthHeaders(userId: string): Record<string, string> {
    const testAuthData: TestAuthData = { userId }
    return {
      ['x-test-auth-header']: JSON.stringify(testAuthData),
    }
  }

  @TestOnly
  private static addTestSession(ctx: HttpArgumentsHost): void {
    const request = ctx.getRequest<SessionRequest>()
    // TODO: other fields?
    const session: Pick<SessionContainer, 'getUserId'> = {
      getUserId(): string {
        const testAuthData = JSON.parse(request.get('x-test-auth-header') ?? '{}') as TestAuthData
        return testAuthData.userId
      },
    }
    request.session = session as SessionContainer
  }
}
