// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import { flatConfigs as importPlugin } from 'eslint-plugin-import'
import parser from '@typescript-eslint/parser'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // Allow classes with only static members
      '@typescript-eslint/no-extraneous-class': 'off',
      
      // Allow async functions without an await in their body
      '@typescript-eslint/require-await': 'off',
      
      // Be less annoyingly strict about string template literals
      '@typescript-eslint/restrict-template-expressions': 'off',
      
      // Just causes problems, and doesn't catch anything the TypeScript compiler doesn't
      'import/named': 'off',

      // Allow unused variables that start with an underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Specify import order
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [['builtin', 'external'], 'parent', 'index', 'sibling', 'object'],
          'newlines-between': 'never',
        },
      ],
    },

    settings: {
      'import/resolver': {
        typescript: {},
      },
    },

    ignores: ['eslint.config.mjs'],
  }
)
