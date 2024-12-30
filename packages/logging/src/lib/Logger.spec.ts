import { Logger } from './Logger'

describe(Logger.name, () => {
  describe('Logging', () => {
    it('Should log against the underlying logger at the appropriate level', () => {
      // TODO
    })

    it('Should format errors', () => {
      // TODO
    })
  })

  describe('Environment variables', () => {
    it('LOG_LEVEL should control the log level', () => {
      // TODO
    })

    it('JSON_LOGS should control log formatting', () => {
      // TODO
    })
  })

  describe('Correlation ids', () => {
    it('Should add correlation ids to logs', () => {
      // TODO
    })
  })

  describe('isLevelEnabled', () => {
    // TODO
  })
})
