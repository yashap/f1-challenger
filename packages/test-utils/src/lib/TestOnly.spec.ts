import { TestOnly } from './TestOnly'

describe('TestOnly', () => {
  const originalNodeEnv = process.env['NODE_ENV']
  const disableTestNodeEnv = () => {
    process.env['NODE_ENV'] = 'foo'
  }

  class Foo {
    @TestOnly
    public foo(): string {
      return 'foo'
    }

    @TestOnly
    public static staticFoo(): string {
      return 'foo'
    }
  }

  afterEach(() => {
    // Reset, because we change this in some tests
    process.env['NODE_ENV'] = originalNodeEnv
  })

  it('throws if you call an annotated instance method outside of a test', () => {
    disableTestNodeEnv()
    expect(() => new Foo().foo()).toThrow()
  })

  it('throws if you call an annotated static method outside of a test', () => {
    disableTestNodeEnv()
    expect(() => Foo.staticFoo()).toThrow()
  })

  it('does not throw if you call an annotated instance method in a test', () => {
    expect(new Foo().foo()).toBe('foo')
  })

  it('does not throw if you call an annotated static method in a test', () => {
    expect(Foo.staticFoo()).toBe('foo')
  })
})
