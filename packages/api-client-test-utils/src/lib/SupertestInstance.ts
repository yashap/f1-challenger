import { ApiAxiosInstance, ApiAxiosRequest, ApiAxiosResponse } from '@f1-challenger/api-client-utils'
import { buildServerErrorFromDto } from '@f1-challenger/errors'
import { Server } from 'http'
import supertest from 'supertest'

/**
 * Wraps supertest so that it satisfies the ApiAxiosInstance contract, and thus can be used with out API clients. For
 * use exclusively in tests
 */
export class SupertestInstance implements ApiAxiosInstance {
  private readonly supertest: supertest.Agent

  constructor(
    httpServer: unknown,
    private readonly defaultHeaders?: Record<string, string>
  ) {
    this.supertest = supertest(httpServer as Server)
  }

  public async request(config: ApiAxiosRequest): Promise<ApiAxiosResponse> {
    const method = config.method.toLowerCase()
    const url = new URL(config.url)
    const pathWithQueryParams = `${url.pathname}${url.search}`
    const maybeRequestBody = config.data ? (JSON.parse(config.data as string) as object) : undefined
    const requestHeaders = { ...this.defaultHeaders, ...config.headers }
    let response: Pick<supertest.Response, 'status' | 'body' | 'headers'> | undefined = undefined
    if (method === 'get') {
      response = await this.supertest.get(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    } else if (method === 'post') {
      response = await this.supertest.post(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    } else if (method === 'patch') {
      response = await this.supertest.patch(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    } else if (method === 'delete') {
      response = await this.supertest.delete(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    }
    if (!response) {
      throw new Error(`Unexpected method: ${config.method}`)
    }
    if (response.status >= 400) {
      throw buildServerErrorFromDto(response.body, response.status)
    }
    return { status: response.status, data: response.body, headers: response.headers }
  }

  public readonly defaults = { baseURL: 'http://example.com' }
}
