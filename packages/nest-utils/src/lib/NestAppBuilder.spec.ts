import { SupertestInstance } from '@f1-challenger/api-client-test-utils'
import { ApiAxiosInstance } from '@f1-challenger/api-client-utils'
import {
  EndpointNotFoundError,
  InputValidationError,
  ResponseValidationError,
  NotFoundError,
  required,
  ServerError,
  InternalServerError,
} from '@f1-challenger/errors'
import { LogLevel, Logger } from '@f1-challenger/logging'
import { v4 as uuid } from 'uuid'
import { expectServerError } from '../test/expectServerError'
import {
  CreateFooRequest,
  Foo,
  FooClient,
  FooRepository,
  ListFoosRequest,
  buildFooApp,
  buildFooClient,
} from '../test/FooApp'
import { NestAppBuilder } from './NestAppBuilder'

describe(NestAppBuilder.name, () => {
  let client: FooClient
  let supertestInstance: ApiAxiosInstance

  const expectSameCorrelationId = (left: { correlationId?: string }, right: { correlationId?: string }): void => {
    expect(left.correlationId).toBeDefined()
    expect(left.correlationId).toHaveLength(uuid().length)
    expect(left.correlationId).toBe(right.correlationId)
  }

  beforeEach(async () => {
    const app = await buildFooApp()
    client = buildFooClient(app)
    supertestInstance = new SupertestInstance(app.getHttpServer())
  })

  describe('validation', () => {
    it('returns valid responses', async () => {
      const requestBody: CreateFooRequest = { name: 'Foo' }
      const response = await client.postFoo({ body: requestBody })
      expect(response.status).toBe(201)
      const expectedResponseBody: Foo = { ...requestBody, id: 1 }
      expect(response.body).toStrictEqual(expectedResponseBody)
    })

    it('returns an InputValidationError for an invalid request body', async () => {
      const invalidPostBody = { name: 10 } as unknown as CreateFooRequest
      const error = await expectServerError(client.postFoo({ body: invalidPostBody }), InputValidationError)
      expect(error.toDto()).toStrictEqual({
        message: 'Invalid request',
        code: 'InputValidationError',
        metadata: {
          bodyErrors: [
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'number',
              path: ['name'],
              message: 'Expected string, received number',
            },
          ],
        },
      })
    })

    it('returns an InputValidationError for invalid query params', async () => {
      const invalidQueryParams = { limit: true } as unknown as ListFoosRequest
      const error = await expectServerError(client.listFoos({ query: invalidQueryParams }), InputValidationError)
      expect(error.toDto()).toStrictEqual({
        message: 'Invalid request',
        code: 'InputValidationError',
        metadata: {
          queryErrors: [
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'nan',
              path: ['limit'],
              message: 'Expected number, received nan',
            },
          ],
        },
      })
    })

    it('returns an EndpointNotFoundError for an unknown endpoint', async () => {
      const error = await expectServerError(
        supertestInstance.request({
          method: 'GET',
          url: 'http://example.com/notARealEndpoint',
          headers: {},
          data: undefined,
        }),
        EndpointNotFoundError
      )
      expect(error.toDto()).toStrictEqual({
        message: 'Endpoint not found',
        code: 'EndpointNotFoundError',
      })
    })

    it('returns a ResponseValidationError for an invalid response', async () => {
      const mockFooRepository = jest
        .spyOn(FooRepository, 'createFoo')
        .mockReturnValue({ oops: 'Not a foo' } as unknown as Foo)
      const error = await expectServerError(client.postFoo({ body: { name: 'Foo' } }), ResponseValidationError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(error.toDto()).toStrictEqual({
        message: 'Invalid response',
        code: 'ResponseValidationError',
        metadata: {
          details: [
            { code: 'invalid_type', expected: 'number', received: 'undefined', path: ['id'], message: 'Required' },
            { code: 'invalid_type', expected: 'string', received: 'undefined', path: ['name'], message: 'Required' },
          ],
        },
      })
    })

    it('returns the thrown error, if a ServerError is thrown', async () => {
      const mockFooRepository = jest.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new NotFoundError('Oops', { metadata: { foo: 'bar' } })
      })
      const error = await expectServerError(client.postFoo({ body: { name: 'Foo' } }), NotFoundError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(error.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'NotFoundError',
        metadata: { foo: 'bar' },
      })
    })
  })

  describe('logging', () => {
    interface LogPayload {
      correlationId?: string
      error?: ServerError
      status?: number
      responseBody?: object
    }

    let mockLog: jest.SpyInstance<void, [level: LogLevel, message: string, metadata: object]>

    const getLogPayload = (level: LogLevel, message: string): LogPayload => {
      const logCall = mockLog.mock.calls.find((args) => args[0] === level && args[1] === message)
      expect(logCall).toBeDefined()
      return required(logCall)[2] as LogPayload
    }

    beforeEach(() => {
      mockLog = jest.spyOn(
        Logger.prototype as unknown as { doLog: (level: LogLevel, message: string, metadata: object) => void },
        'doLog'
      )
    })

    it('logs 200s', async () => {
      await client.listFoos({ query: { limit: 10 } })
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(getLogPayload(LogLevel.Info, 'Request completed successfully')).toEqual(
        expect.objectContaining({
          status: 200,
          method: 'GET',
          path: '/foos',
        })
      )
    })

    it('logs 201s', async () => {
      await client.postFoo({ body: { name: 'Foo' } })
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(getLogPayload(LogLevel.Info, 'Request completed successfully')).toEqual(
        expect.objectContaining({
          status: 201,
          method: 'POST',
          path: '/foos',
        })
      )
    })

    it('logs 400s, twice (http response and caught exception), with the same correlation id', async () => {
      const mockFooRepository = jest.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new InputValidationError('Oops', { metadata: { foo: 'bar' } })
      })
      await expectServerError(client.postFoo({ body: { name: 'Foo' } }), InputValidationError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledTimes(2)
      const httpResponseLogPayload = getLogPayload(LogLevel.Warn, 'Returning 4xx error')
      const exceptionLogPayload = getLogPayload(LogLevel.Warn, 'Caught exception')
      expect(httpResponseLogPayload).toEqual(
        expect.objectContaining({
          status: 400,
          method: 'POST',
          path: '/foos',
        })
      )
      expect(exceptionLogPayload.status).toBe(400)
      expect(exceptionLogPayload.error?.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'InputValidationError',
        metadata: {
          foo: 'bar',
        },
      })
      expect(exceptionLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expectSameCorrelationId(httpResponseLogPayload, exceptionLogPayload)
    })

    it('logs 404s, twice (http response and caught exception), with the same correlation id', async () => {
      const mockFooRepository = jest.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new NotFoundError('Oops', { metadata: { foo: 'bar' } })
      })
      await expectServerError(client.postFoo({ body: { name: 'Foo' } }), NotFoundError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledTimes(2)
      const httpResponseLogPayload = getLogPayload(LogLevel.Warn, 'Returning 4xx error')
      const exceptionLogPayload = getLogPayload(LogLevel.Warn, 'Caught exception')
      expect(httpResponseLogPayload).toEqual(
        expect.objectContaining({
          status: 404,
          method: 'POST',
          path: '/foos',
        })
      )
      expect(exceptionLogPayload.status).toBe(404)
      expect(exceptionLogPayload.error?.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'NotFoundError',
        metadata: {
          foo: 'bar',
        },
      })
      expect(exceptionLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expectSameCorrelationId(httpResponseLogPayload, exceptionLogPayload)
    })

    it('logs 500s, twice (http response and caught exception), with the same correlation id', async () => {
      const mockFooRepository = jest.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new InternalServerError('Oops', { metadata: { foo: 'bar' } })
      })
      await expectServerError(client.postFoo({ body: { name: 'Foo' } }), InternalServerError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledTimes(2)
      const httpResponseLogPayload = getLogPayload(LogLevel.Error, 'Returning 5xx error')
      const exceptionLogPayload = getLogPayload(LogLevel.Error, 'Caught exception')
      expect(httpResponseLogPayload).toEqual(
        expect.objectContaining({
          status: 500,
          method: 'POST',
          path: '/foos',
        })
      )
      expect(exceptionLogPayload.status).toBe(500)
      expect(exceptionLogPayload.error?.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'InternalServerError',
        metadata: {
          foo: 'bar',
        },
      })
      expect(exceptionLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expectSameCorrelationId(httpResponseLogPayload, exceptionLogPayload)
    })
  })
})
