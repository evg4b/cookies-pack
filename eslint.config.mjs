import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import typescript from 'typescript-eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    typescript.configs.strictTypeChecked,
    typescript.configs.stylisticTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    jsxA11y.flatConfigs.strict,
  ],
  languageOptions: {
    ...jsxA11y.flatConfigs.recommended.languageOptions,
    ...react.configs.flat.recommended.languageOptions,
    globals: globals.browser,
    parserOptions: {
      projectService: true,
    },
  },
  settings: {
    react: { version: '19' },
  }
});