import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginCypress from 'eslint-plugin-cypress/flat';
import eslintConfigPrettier from 'eslint-config-prettier';
//jest

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  pluginCypress.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/member-ordering": "warn",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-function-return-type": "error"
    }
  },
  {
    ignores: [
      '.angular',
      'cypress.config.ts',
      'cypress-test.config.ts',
      'node_modules',
      'dist',
      "public",
      'build',
      'coverage',
      'package-lock.json'
    ]
  }
];
