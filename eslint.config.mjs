import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.strict,
  {
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);