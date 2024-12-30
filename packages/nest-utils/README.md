# @f1-challenger/nest-utils

Utilities for NestJS apps.

## Example Usage

```ts
import { Module } from '@nestjs/common'
import { NestAppBuilder, NestAppRunner } from '@f1-challenger/nest-utils'

// Create a root NestJS module
@Module({
  imports: [...], // All the NestJS modules for your app
})
class AppModule {}

const serviceName: string = ...
const port: number = ...

const app = await NestAppBuilder.build(AppModule)
await NestAppRunner.run(app, port)
```
