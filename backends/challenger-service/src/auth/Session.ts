import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Session = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request: { session: any } = ctx.switchToHttp().getRequest()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return request.session
})
