import baseConfig from '@f1-challenger/eslint-config/default.config.mjs'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'

export default [
  ...baseConfig,
  {
    ignores: ['drizzle.config.ts'],
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      // Allow only absolute imports, no relative imports
      'no-relative-import-paths/no-relative-import-paths': ['error', { allowSameFolder: false }],
    },
  },
]
