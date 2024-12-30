import { ServerError, buildServerErrorFromDto } from '@f1-challenger/errors'
import { HTTPStatusCode } from '@ts-rest/core'

type TsRestResponse<ResponseBody, SuccessStatus extends number> =
  | { status: SuccessStatus; body: ResponseBody }
  | { status: Exclude<HTTPStatusCode, SuccessStatus>; body: unknown }

const buildError = (response: { status: number; body: unknown }): Error =>
  buildServerErrorFromDto(response.body, response.status)

const extract200 = async <T>(response: TsRestResponse<T, 200> | Promise<TsRestResponse<T, 200>>): Promise<T> => {
  const resp = await response
  if (resp.status === 200) {
    return resp.body
  } else {
    throw buildError(resp)
  }
}

/**
 * Extract the response from a GET request (specifically getting one resource by id) made with ts-rest.
 *
 * @param response The ts-rest response object
 * @returns The response body if found, undefined if
 */
export const extractGetByIdResponse = async <T>(
  response: TsRestResponse<T, 200> | Promise<TsRestResponse<T, 200>>
): Promise<T | undefined> => {
  try {
    const resp = await response
    if (resp.status === 404) {
      return undefined
    }
    return await extract200(resp)
  } catch (error) {
    if ((error as Partial<ServerError>).httpStatusCode === 404) {
      return undefined
    }
    throw error
  }
}

// Extract the response from a GET request (specifically listing resources) made with ts-rest
export const extractListResponse = extract200

// Extract the response from a POST request made with ts-rest
export const extractPostResponse = async <T>(
  response: TsRestResponse<T, 201> | Promise<TsRestResponse<T, 201>>
): Promise<T> => {
  const resp = await response
  if (resp.status === 201) {
    return resp.body
  } else {
    throw buildError(resp)
  }
}

// Extract the response from a PATCH request made with ts-rest
export const extractPatchResponse = extract200

// Extract the response from a DELETE request made with ts-rest
export const extractDeleteResponse = async (
  response: TsRestResponse<unknown, 204> | Promise<TsRestResponse<unknown, 204>>
): Promise<void> => {
  const resp = await response
  if (resp.status === 204) {
    return undefined
  } else {
    throw buildError(resp)
  }
}
