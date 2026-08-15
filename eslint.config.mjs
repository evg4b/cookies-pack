import js from '@eslint/js';
import typescript from 'typescript-eslint';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import-x';
import tsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...typescript.configs.strictTypeChecked,
  ...typescript.configs.stylisticTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  importPlugin.flatConfigs.react,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          projectService: true,
        }),
      ],
      react: {
        version: '19',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,mtsx}'],
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 'off',
      'import-x/consistent-type-specifier-style': ["error", "prefer-inline"],
      "import-x/extensions": ["error", "never", { "fix": true }]
    }
  },
  {
    files: ['**/*.test.{ts,tsx,mtsx}'],
    rules: {}
  }
]