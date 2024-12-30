import { ServerError } from '@f1-challenger/errors'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerErrorConstructor<E extends ServerError> = new (...args: any[]) => E

export const expectServerError = async <E extends ServerError>(
  maybeFailed: Promise<unknown>,
  errorConstructor: ServerErrorConstructor<E>
): Promise<E> => {
  await expect(maybeFailed).rejects.toThrow(errorConstructor)
  try {
    await maybeFailed
  } catch (error) {
    return error as E
  }
  throw new Error('Unreachable')
}
