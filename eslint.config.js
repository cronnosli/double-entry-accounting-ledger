// eslint.config.js
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import decoratorPosition from 'eslint-plugin-decorator-position';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'decorator-position': decoratorPosition,
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-var-requires': 'error',

      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error',

      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],

      'prettier/prettier': 'error',

      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'decorator-position/decorator-position': [
        'error',
        {
          properties: 'above',
          methods: 'above',
        },
      ],
      'curly': ['error', 'all'],
    },
  },
];
