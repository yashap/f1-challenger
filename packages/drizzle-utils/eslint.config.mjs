import baseConfig from '@f1-challenger/eslint-config/default.config.mjs'

export default [
  ...baseConfig,
  {
    ignores: ['drizzle.config.ts'],
  },
]
