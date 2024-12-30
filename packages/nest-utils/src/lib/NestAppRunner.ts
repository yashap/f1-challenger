import { Logger } from '@f1-challenger/logging'
import { INestApplication } from '@nestjs/common'

export class NestAppRunner {
  private static logger: Logger = new Logger(NestAppRunner.name)

  public static async run(app: INestApplication, port: number): Promise<void> {
    await app.listen(port)
    this.logger.info(`🚀 Listening for requests`, { port })
  }
}
