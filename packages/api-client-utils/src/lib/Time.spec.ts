import { TimeSchema } from './Time'

describe('TimeSchema', () => {
  it('allows valid times', () => {
    expect(TimeSchema.parse('00:00:00')).toBe('00:00:00')
    expect(TimeSchema.parse('12:13:14')).toBe('12:13:14')
    expect(TimeSchema.parse('23:59:59')).toBe('23:59:59')
  })

  it('does not allow invalid times', () => {
    expect(() => TimeSchema.parse('hello')).toThrow()
    expect(() => TimeSchema.parse('T00:00:00')).toThrow()
    expect(() => TimeSchema.parse('-00:00:00')).toThrow()
    expect(() => TimeSchema.parse('1:00:00')).toThrow()
    expect(() => TimeSchema.parse('24:00:00')).toThrow()
    expect(() => TimeSchema.parse('12:60:00')).toThrow()
    expect(() => TimeSchema.parse('12:00:60')).toThrow()
    expect(() => TimeSchema.parse('12:00:01.1')).toThrow()
    expect(() => TimeSchema.parse('2012-11-12T12:00:60')).toThrow()
    expect(() => TimeSchema.parse('2012-11-12')).toThrow()
  })
})
