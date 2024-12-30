import { SupertestInstance } from '@f1-challenger/api-client-test-utils'
import { ApiClient, ApiClientBuilder, SchemaBuilder } from '@f1-challenger/api-client-utils'
import { INestApplication, Controller, Module } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { Endpoint, HandlerResult, handler } from '../lib/Endpoint'
import { NestAppBuilder } from '../lib/NestAppBuilder'

/**
 * This is a basic Nest server, with a client/server contract defined using ts-rest, that makes it easy to test our nest-utils
 */

const c = initContract()

const FooSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const CreateFooRequestSchema = FooSchema.omit({ id: true })

export const ListFoosRequestSchema = z.object({
  limit: z.coerce.number(),
})

export const ListFoosResponseSchema = SchemaBuilder.buildListResponse(FooSchema)

export type Foo = z.infer<typeof FooSchema>
export type CreateFooRequest = z.infer<typeof CreateFooRequestSchema>
export type ListFoosRequest = z.infer<typeof ListFoosRequestSchema>
export type ListFoosResponse = z.infer<typeof ListFoosResponseSchema>

const contract = c.router({
  postFoo: {
    method: 'POST',
    path: '/foos',
    responses: {
      201: FooSchema,
    },
    body: CreateFooRequestSchema,
  },
  listFoos: {
    method: 'GET',
    path: '/foos',
    responses: {
      200: ListFoosResponseSchema,
    },
    query: ListFoosRequestSchema,
  },
})

export type FooClient = ApiClient<typeof contract>

export class FooRepository {
  private static currentId = 1
  private static foos: Foo[] = []

  public static createFoo(body: CreateFooRequest): Foo {
    const id = this.currentId
    this.currentId++
    const foo = { ...body, id }
    this.foos.push(foo)
    return foo
  }

  public static listFoos({ limit }: ListFoosRequest): Foo[] {
    return this.foos.slice(0, limit)
  }

  public static clear(): void {
    this.currentId = 1
    this.foos = []
  }
}

@Controller()
class FooController {
  @Endpoint(contract.postFoo)
  public post(): HandlerResult<typeof contract.postFoo> {
    return handler(contract.postFoo, async ({ body }) => {
      const foo = FooRepository.createFoo(body)
      return { status: 201, body: foo }
    })
  }

  @Endpoint(contract.listFoos)
  public list(): HandlerResult<typeof contract.listFoos> {
    return handler(contract.listFoos, async ({ query }) => {
      const foos = FooRepository.listFoos(query)
      return { status: 200, body: { data: foos, pagination: {} } }
    })
  }
}

@Module({ controllers: [FooController] })
class FooModule {}

export const buildFooApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({ imports: [FooModule] }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  await app.init()
  return app
}

export const buildFooClient = (app: INestApplication): FooClient => {
  const supertestInstance = new SupertestInstance(app.getHttpServer())
  return ApiClientBuilder.build(contract, supertestInstance)
}
