import { required } from '@f1-challenger/errors'
import { AppRouter, ClientArgs, InitClientReturn, initClient } from '@ts-rest/core'

type TsRestClientArgs = Required<Pick<ClientArgs, 'baseUrl' | 'baseHeaders' | 'api'>>
export type ApiClient<C extends AppRouter> = InitClientReturn<C, TsRestClientArgs>

// The type of AxiosInstance changes a lot, this is a slim dependency on just what we need
export interface ApiAxiosInstance {
  request: (config: ApiAxiosRequest) => Promise<ApiAxiosResponse>
  defaults: {
    baseURL?: string
  }
}

export interface ApiAxiosRequest {
  method: string
  url: string
  headers: Record<string, string>
  data: unknown
}

export interface ApiAxiosResponse {
  status: number
  data: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: any
}

export class ApiClientBuilder {
  public static build<C extends AppRouter>(contract: C, axiosInstance: ApiAxiosInstance): ApiClient<C> {
    return initClient(contract, {
      baseUrl: required(axiosInstance.defaults.baseURL, 'Axios instance must have a baseURL set'),
      baseHeaders: {},
      api: async ({ path, method, headers, body }) => {
        const response = await axiosInstance.request({
          method: method,
          url: path,
          headers,
          data: body,
        })
        return {
          status: response.status,
          body: response.data,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          headers: response.headers,
        }
      },
    })
  }
}
