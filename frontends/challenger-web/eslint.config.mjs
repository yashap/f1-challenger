import baseConfig from '@f1-challenger/eslint-config/default.config.mjs'
import globals from 'globals'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  ...baseConfig,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Allow only absolute imports, no relative imports
      'no-relative-import-paths/no-relative-import-paths': ['error', { allowSameFolder: false }],
    },
  },
]
