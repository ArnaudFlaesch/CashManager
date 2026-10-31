import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import pluginCypress from "eslint-plugin-cypress";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".angular", "coverage", "dist", "node_modules", "package-lock.json"]),
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
  eslintConfigPrettier
]);
