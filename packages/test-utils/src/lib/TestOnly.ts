/**
 * A decorator that ensures a method is only called in tests, otherwise it'll throw an error.
 *
 * Example usage:
 *
 * ```
 * class Foo {
 *   @TestOnly
 *   public static mock(): void { ... }
 * }
 * ```
 *
 * For the above example, calling Foo.mock() in test code is fine, but calling it in main code will throw.
 */
export const TestOnly = (_target: unknown, methodName: string, descriptor: PropertyDescriptor) => ({
  value(...args: unknown[]) {
    if (process.env['NODE_ENV']?.toLowerCase() !== 'test') {
      throw new Error(`${methodName} is a test only method, can only be called from tests`)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const result = descriptor.value.apply(this, args)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result
  },
})
