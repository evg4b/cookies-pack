import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import typescript from 'typescript-eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    typescript.configs.strictTypeChecked,
    typescript.configs.stylisticTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
  ],
  languageOptions: {
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