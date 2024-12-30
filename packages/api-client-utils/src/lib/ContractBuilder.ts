import { PaginatedResponseSchema } from '@f1-challenger/pagination'
import { z, ZodTypeAny } from 'zod'
import { ServerErrorSchema } from './ServerError'

const AllErrors = {
  400: ServerErrorSchema,
  401: ServerErrorSchema,
  403: ServerErrorSchema,
  404: ServerErrorSchema,
  500: ServerErrorSchema,
} as const

const AllErrorsExcept404 = {
  400: ServerErrorSchema,
  401: ServerErrorSchema,
  403: ServerErrorSchema,
  500: ServerErrorSchema,
} as const

export class ContractBuilder {
  /**
   * Builds the default `responses` section of a `ts-rest` contract for a GET request. Returns 200 on success, or any
   * of our standard error codes on failure.
   *
   * If you wish to have a non-standard GET endpoint (for example, returning something other than 200 on success),
   * don't make this method more flexible/complex, just skip using it entirely, write your own responses section.
   *
   * @param successSchema The Zod schema describing the response body for a successful request
   * @returns The `responses` section of a `ts-rest` contract
   */
  public static buildGetResponses<T extends ZodTypeAny>(successSchema: T) {
    return {
      200: successSchema,
      ...AllErrors,
    }
  }

  /**
   * Builds the default `responses` section of a `ts-rest` contract for a LIST request - a GET request, but one that
   * lists items matching query params, vs. getting a specific item by id.). Returns 200 on success, or any of our
   * our standard error codes except 404 on failure (as you aren't looking for a specific item, 404 doesn't make
   * sense).
   *
   * If you wish to have a non-standard LIST endpoint (for example, returning something other than 200 on success),
   * don't make this method more flexible/complex, just skip using it entirely, write your own responses section.
   *
   * @param successSchema The Zod schema describing the response body for a successful request
   * @returns The `responses` section of a `ts-rest` contract
   */
  public static buildListResponses<Item extends ZodTypeAny, T extends PaginatedResponseSchema<Item>>(successSchema: T) {
    return {
      200: successSchema,
      ...AllErrorsExcept404,
    }
  }

  /**
   * Builds the default `responses` section of a `ts-rest` contract for a POST request. Returns 201 on success, or any
   * of our our standard error codes except 404 on failure (as you aren't looking for a specific item, 404 doesn't make
   * sense).
   *
   * If you wish to have a non-standard POST endpoint (for example, returning something other than 201 on success),
   * don't make this method more flexible/complex, just skip using it entirely, write your own responses section.
   *
   * @param successSchema The Zod schema describing the response body for a successful request
   * @returns The `responses` section of a `ts-rest` contract
   */
  public static buildPostResponses<T extends ZodTypeAny>(successSchema: T) {
    return {
      201: successSchema,
      ...AllErrorsExcept404,
    }
  }

  /**
   * Builds the default `responses` section of a `ts-rest` contract for a PATCH request. Returns 200 on success, or any
   * of our standard error codes on failure.
   *
   * If you wish to have a non-standard PATCH endpoint (for example, returning something other than 200 on success),
   * don't make this method more flexible/complex, just skip using it entirely, write your own responses section.
   *
   * @param successSchema The Zod schema describing the response body for a successful request
   * @returns The `responses` section of a `ts-rest` contract
   */
  public static buildPatchResponses<T extends ZodTypeAny>(successSchema: T) {
    return {
      200: successSchema,
      ...AllErrors,
    }
  }

  /**
   * Builds the default `responses` section of a `ts-rest` contract for a DELETE request. Returns 204 with no response
   * body on success, or any of our standard error codes on failure.
   *
   * If you wish to have a non-standard DELETE endpoint (for example, returning something other than 204 on success),
   * don't make this method more flexible/complex, just skip using it entirely, write your own responses section.
   *
   * @param successSchema The Zod schema describing the response body for a successful request
   * @returns The `responses` section of a `ts-rest` contract
   */
  public static buildDeleteResponses() {
    return {
      204: z.undefined(),
      ...AllErrors,
    }
  }
}
