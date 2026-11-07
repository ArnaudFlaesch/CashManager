// @ts-check
import js from "@eslint/js";
import angular from "angular-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import vitest from "@vitest/eslint-plugin";
import pluginCypress from "eslint-plugin-cypress";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Generated files (node_modules is ignored by default)
  globalIgnores([
    ".angular/",
    "coverage/",
    "cypress/reports/",
    "cypress/results/",
    "dist/"
  ]),

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error"
    }
  },

  // All JavaScript and TypeScript files
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [js.configs.recommended]
  },

  // TypeScript, with type information from the tsconfig of each file
  {
    files: ["**/*.ts"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          // Root config files are not part of any tsconfig
          allowDefaultProject: ["*.ts"]
        },
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/explicit-member-accessibility": "error",
      // Numbers read well in template literals, such as `${width}px`
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true }
      ],
      // Angular components, directives and modules can be empty classes
      "@typescript-eslint/no-extraneous-class": [
        "error",
        { allowWithDecorator: true }
      ]
    }
  },

  // Angular application code
  {
    files: ["src/**/*.ts"],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: { globals: globals.browser },
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "cash-manager", style: "kebab-case" }
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "cashManager", style: "camelCase" }
      ],
      // Modern Angular APIs
      "@angular-eslint/prefer-signals": "error",
      "@angular-eslint/prefer-signal-model": "error",
      "@angular-eslint/prefer-output-emitter-ref": "error",
      "@angular-eslint/prefer-output-readonly": "error",
      "@angular-eslint/prefer-service-decorator": "error",
      "@angular-eslint/prefer-host-metadata-property": "error",
      // Signals
      "@angular-eslint/computed-must-return": "error",
      "@angular-eslint/no-uncalled-signals": "error",
      "@angular-eslint/no-implicit-take-until-destroyed": "error",
      // Components, directives and pipes
      "@angular-eslint/consistent-component-styles": "error",
      "@angular-eslint/relative-url-prefix": "error",
      "@angular-eslint/use-component-selector": "error",
      "@angular-eslint/use-component-view-encapsulation": "error",
      "@angular-eslint/no-duplicates-in-metadata-arrays": "error",
      "@angular-eslint/no-pipe-impure": "error",
      "@angular-eslint/contextual-decorator": "error",
      // Lifecycle hooks
      "@angular-eslint/no-async-lifecycle-method": "error",
      "@angular-eslint/no-lifecycle-call": "error",
      "@angular-eslint/require-lifecycle-on-prototype": "error",
      "@angular-eslint/sort-lifecycle-methods": "error"
    }
  },

  // Unit tests, run with Vitest
  {
    files: ["src/**/*.spec.ts"],
    extends: [vitest.configs.recommended],
    settings: { vitest: { typecheck: true } },
    rules: {
      // Replaced by the Vitest version, which allows `expect(service.method).toHaveBeenCalled()`
      "@typescript-eslint/unbound-method": "off",
      "vitest/unbound-method": "error",
      // Focused or skipped tests must not be committed
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
      // Consistent and precise tests
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/no-standalone-expect": "error",
      "vitest/prefer-hooks-on-top": "error",
      "vitest/prefer-hooks-in-order": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-contain": "error",
      "vitest/prefer-to-have-length": "error",
      "vitest/prefer-spy-on": "error"
    }
  },

  // Angular templates, external and inline
  {
    files: ["src/**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility
    ],
    rules: {
      "@angular-eslint/template/button-has-type": "error",
      "@angular-eslint/template/no-duplicate-attributes": "error",
      "@angular-eslint/template/no-empty-control-flow": "error",
      "@angular-eslint/template/no-positive-tabindex": "error",
      "@angular-eslint/template/prefer-at-else": "error",
      "@angular-eslint/template/prefer-at-empty": "error",
      "@angular-eslint/template/prefer-built-in-pipes": "error",
      "@angular-eslint/template/prefer-contextual-for-variables": "error",
      "@angular-eslint/template/prefer-ngsrc": "error",
      "@angular-eslint/template/prefer-self-closing-tags": "error",
      "@angular-eslint/template/prefer-static-string-properties": "error",
      "@angular-eslint/template/prefer-template-literal": "error",
      // Styles belong in SCSS files: class bindings, never inline styles
      "@angular-eslint/template/prefer-class-binding": "error",
      "@angular-eslint/template/no-inline-styles": [
        "error",
        { allowBindToStyle: false }
      ]
    }
  },

  // Cypress end-to-end tests, run in the browser
  {
    files: ["cypress/**/*.ts"],
    extends: [pluginCypress.configs.recommended]
  },

  // Node.js: tooling config files and the Cypress plugins
  {
    files: ["*.{js,mjs,cjs,ts}", "cypress/plugins/**/*.ts"],
    languageOptions: { globals: globals.node }
  },

  // Turns off the rules that conflict with Prettier, must stay last
  eslintConfigPrettier
]);
