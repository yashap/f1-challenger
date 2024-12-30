import { ContextPropagator } from './ContextPropagator'

describe(ContextPropagator.name, () => {
  interface Context {
    foo: string
  }

  const propagator = new ContextPropagator<Context>()

  const funcA = (): Context => {
    const context = propagator.getContext()
    if (!context) {
      throw new Error('No context')
    }
    return context
  }

  const funcB = (): Promise<Context> => Promise.resolve(funcA())

  const getDeeplyNestedContext = async (): Promise<Context> => {
    try {
      throw Error('trigger error')
    } catch (_error) {
      return await funcB()
    }
  }

  const sleep = (milliseconds: number): Promise<number> =>
    new Promise((resolve) => setTimeout(resolve as () => void, milliseconds))

  it('propagates context within a continuation', () => {
    propagator.runWithContext({ foo: 'bar' }, () => {
      expect(propagator.getContext()).toStrictEqual({ foo: 'bar' })
    })
  })

  it('returns undefined if context is not set', () => {
    expect(propagator.getContext()).toBeUndefined()
  })

  it('resets context after a continuation ends', () => {
    propagator.runWithContext({ foo: 'bar' }, () => {
      expect(propagator.getContext()).toStrictEqual({ foo: 'bar' })
    })
    expect(propagator.getContext()).toBeUndefined()
  })

  it('overwrites existing context when using nested runWithContext', () => {
    propagator.runWithContext({ foo: 'bar' }, () => {
      expect(propagator.getContext()).toStrictEqual({ foo: 'bar' })
      propagator.runWithContext({ foo: 'baz' }, () => {
        expect(propagator.getContext()).toStrictEqual({ foo: 'baz' })
      })
      expect(propagator.getContext()).toStrictEqual({ foo: 'bar' })
    })
  })

  it('propagates context within an async continuation', async () => {
    await propagator.runWithContext({ foo: 'bar' }, async () => {
      expect(propagator.getContext()).toStrictEqual({ foo: 'bar' })
    })
  })

  it('propagates context in deep, mixed synchronous/async continuations', async () => {
    const context = await propagator.runWithContext({ foo: 'bar' }, getDeeplyNestedContext)
    expect(context).toStrictEqual({ foo: 'bar' })
  })

  it('propagates context in multiple, concurrent async continuations', async () => {
    const getContextWithRandomSleep = async (context: Context): Promise<Context> => {
      return await propagator.runWithContext(context, async () => {
        await sleep(Math.random() * 50)
        return getDeeplyNestedContext()
      })
    }

    const [context1, context2, context3, context4, context5] = await Promise.all([
      getContextWithRandomSleep({ foo: '1' }),
      getContextWithRandomSleep({ foo: '2' }),
      getContextWithRandomSleep({ foo: '3' }),
      getContextWithRandomSleep({ foo: '4' }),
      getContextWithRandomSleep({ foo: '5' }),
    ])

    expect(context1).toStrictEqual({ foo: '1' })
    expect(context2).toStrictEqual({ foo: '2' })
    expect(context3).toStrictEqual({ foo: '3' })
    expect(context4).toStrictEqual({ foo: '4' })
    expect(context5).toStrictEqual({ foo: '5' })
  })
})
