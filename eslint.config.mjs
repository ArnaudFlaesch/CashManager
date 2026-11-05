import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import pluginCypress from "eslint-plugin-cypress";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    ".angular",
    "coverage",
    "cypress/reports",
    "cypress/results",
    "dist",
    "node_modules",
    "package-lock.json"
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["cypress/**/*.ts"],
    extends: [pluginCypress.configs.recommended]
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.stylistic, angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "cashManager", style: "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "cash-manager", style: "kebab-case" }
      ]
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility
    ]
  },
  eslintConfigPrettier
]);
