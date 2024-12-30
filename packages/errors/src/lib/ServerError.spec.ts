import { ErrorOptions, ServerError, ServerErrorDto } from './ServerError'
import {
  buildServerErrorFromDto,
  InputValidationError,
  InternalServerError,
  NotFoundError,
  UnknownError,
} from './serverErrors'

describe(ServerError.name, () => {
  describe(ServerError.isServerErrorDto.name, () => {
    it('returns true if the error is a ServerErrorDto', () => {
      expect(ServerError.isServerErrorDto(new InternalServerError('Oh no').toDto())).toBe(true)
      expect(ServerError.isServerErrorDto(new NotFoundError('Oh no').toDto())).toBe(true)
    })

    it('returns true if the error is not a ServerErrorDto', () => {
      expect(ServerError.isServerErrorDto(new Error('Oh no'))).toBe(false)
    })
  })

  describe('toDto', () => {
    it('converts a ServerError to a ServerErrorDto, with metadata', () => {
      const expected: ServerErrorDto<{ foo: string }> = {
        message: 'Oh no',
        code: 'InternalServerError',
        metadata: { foo: 'bar' },
      }
      expect(
        new InternalServerError('Oh no', {
          metadata: { foo: 'bar' },
        }).toDto()
      ).toStrictEqual(expected)
    })

    it('converts a ServerError to a ServerErrorDto, with all optional fields missing', () => {
      const expected: ServerErrorDto = {
        message: 'Oh no',
        code: 'InternalServerError',
      }
      expect(new InternalServerError('Oh no').toDto()).toStrictEqual(expected)
    })
  })

  describe(buildServerErrorFromDto.name, () => {
    it('converts a ServerErrorDto to a ServerError', () => {
      const internalServerErrorDto: ServerErrorDto<{ foo: string }> = {
        message: 'Oh no',
        code: 'InternalServerError',
        metadata: { foo: 'bar' },
      }
      const notFoundErrorDto: ServerErrorDto = {
        message: 'Oh no',
        code: 'NotFoundError',
      }
      expect(buildServerErrorFromDto(internalServerErrorDto, 500)).toStrictEqual(
        new InternalServerError('Oh no', {
          metadata: { foo: 'bar' },
        })
      )
      expect(buildServerErrorFromDto(notFoundErrorDto, 404)).toStrictEqual(new NotFoundError('Oh no'))
    })

    it('converts anything unrecognized to an UnknownError', () => {
      expect(buildServerErrorFromDto(20, 501)).toStrictEqual(
        new UnknownError('Unexpected response from server', 501, {
          cause: 20,
          metadata: { response: { body: 20 } },
        })
      )
    })
  })

  describe('properties', () => {
    it('have expected values', () => {
      const options: ErrorOptions = {
        cause: new Error('Bam'),
        internalMessage: 'Boom internal',
        metadata: {
          id: '10',
          foo: true,
        },
      }
      const error = new InternalServerError('Boom', options)
      expect(error.message).toBe('Boom')
      expect(error.name).toBe('InternalServerError')
      expect(error.code).toBe('InternalServerError')
      expect(error.cause).toBe(options.cause)
      expect(error.internalMessage).toBe(options.internalMessage)
      expect(error.metadata).toBe(options.metadata)
    })

    it("cause is set only if it's an error", () => {
      const err1 = new Error('foo')
      const err2 = new InternalServerError('bar')
      const notError = { message: 'foo', name: 'bar' }
      expect(new InputValidationError('bah', { cause: err1 }).cause).toBe(err1)
      expect(new InputValidationError('bah', { cause: err2 }).cause).toBe(err2)
      expect(new InputValidationError('bah', { cause: notError }).cause).toBeUndefined()
    })
  })
})
