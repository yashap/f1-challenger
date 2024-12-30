import { Response } from 'express'

/**
 * A type for the function that can be registered as either a close, finish or error listener on an Express Response.
 * On-close/finish takes a function of type `() => void`, while on-error takes a function of type
 * `(error: Error) => void`, so `(error?: Error) => void` works for all three event listeners.
 */
type OnCompleteListener = (error?: Error) => void

// Run a callback when an Express Response completes.
export const onResponseComplete = (res: Response): ((callback: OnCompleteListener) => void) => {
  return (callback: OnCompleteListener): void => {
    const onComplete = (error?: Error): void => {
      callback(error)
      res.removeListener('close', onComplete)
      res.removeListener('finish', onComplete)
      res.removeListener('error', onComplete)
    }
    res.on('close', onComplete)
    res.on('finish', onComplete)
    res.on('error', onComplete)
  }
}
