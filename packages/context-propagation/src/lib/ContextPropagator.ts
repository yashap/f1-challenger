import type { AsyncLocalStorage } from 'async_hooks'

export class ContextPropagator<T> {
  private readonly storage: AsyncLocalStorage<T> | undefined = this.createStorage()

  /**
   * Run a callback with "context" - any code within the callback can call getContext() on the same instance of
   * ContextPropagator that runWithContext was called against, and access said context.
   *
   * This is useful for things like setting a correlationId at the entrypoint of some code path, and then accessing
   * said correlationId when logging, so that all logs for a given invocation of a code path have the same
   * correlationId, and can thus easily be associated with one another. For non-critical data like this, it's very
   * convenient to not have to explicitly pass it down the call stack.
   *
   * @param context The context to set
   * @param callback The function, where you want the context to be accessible via a getContext() call
   * @returns The result of running the callback
   */
  public runWithContext<R>(context: T, callback: () => R): R {
    if (!this.storage) {
      return callback()
    }

    return this.storage.run(context, callback)
  }

  /**
   * Get context set earlier (by a call to runWithContext). If no context was set, returns undefined.
   *
   * @returns Context set by runWithContext, or undefined
   */
  public getContext(): T | undefined {
    return this.storage?.getStore()
  }

  private createStorage(): AsyncLocalStorage<T> | undefined {
    // Do not import CLS on platforms other than Node.js.
    if (!process.versions.node) {
      return undefined
    }

    // Import AsyncLocalStorage dynamically to make this class compatible on platforms other than Node.js.
    // eslint-disable-next-line
    return new (require('async_hooks').AsyncLocalStorage)() as AsyncLocalStorage<T>
  }
}
