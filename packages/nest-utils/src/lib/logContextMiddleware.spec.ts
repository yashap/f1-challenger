import { CorrelationIdPropagator } from '@f1-challenger/correlation-id-propagator'
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { logContextMiddleware } from './logContextMiddleware'

describe(logContextMiddleware.name, () => {
  const sleep = (milliseconds: number): Promise<number> =>
    new Promise((resolve) => setTimeout(resolve as () => void, milliseconds))

  it('sets a correlationId', async () => {
    let correlationIdWithinEndpoint: string | undefined = undefined

    const request = {
      method: 'GET',
      url: 'http://example.com/users/123',
    } as Request

    logContextMiddleware(request, {} as Response, () => {
      correlationIdWithinEndpoint = CorrelationIdPropagator.getContext()
    })

    expect(correlationIdWithinEndpoint).toBeDefined()
    expect(correlationIdWithinEndpoint).toHaveLength(uuid().length)
  })

  it('sets correlationIds with multiple concurrent requests', async () => {
    let correlationId1: string | undefined = undefined
    let correlationId2: string | undefined = undefined
    let correlationId3: string | undefined = undefined

    const request = {} as Request
    const response = {} as Response

    // Kick off 3 concurrent requests
    let callsCompleted = 0
    /* eslint-disable @typescript-eslint/no-misused-promises */
    logContextMiddleware(request, response, async () => {
      await sleep(50)
      correlationId1 = CorrelationIdPropagator.getContext()
      callsCompleted += 1
    })
    logContextMiddleware(request, response, async () => {
      await sleep(50)
      correlationId2 = CorrelationIdPropagator.getContext()
      callsCompleted += 1
    })
    logContextMiddleware(request, response, async () => {
      await sleep(50)
      correlationId3 = CorrelationIdPropagator.getContext()
      callsCompleted += 1
    })
    /* eslint-enable @typescript-eslint/no-misused-promises */

    // Wait for all 3 concurrent requests to complete
    while (callsCompleted < 3) {
      await sleep(10)
    }

    // Ensure they all have the expected data
    expect(correlationId1).toBeDefined()
    expect(correlationId2).toBeDefined()
    expect(correlationId3).toBeDefined()
    expect(correlationId1).toHaveLength(uuid().length)
    expect(correlationId2).toHaveLength(uuid().length)
    expect(correlationId3).toHaveLength(uuid().length)
    expect(correlationId1).not.toEqual(correlationId2)
    expect(correlationId1).not.toEqual(correlationId3)
    expect(correlationId2).not.toEqual(correlationId3)
  })
})
