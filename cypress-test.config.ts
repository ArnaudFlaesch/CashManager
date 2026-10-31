import { defineConfig } from "cypress";
import baseConfig from "./cypress.config";

// Configuration used by the CI: longer timeouts, retries and screenshots of the failed tests
export default defineConfig({
  ...baseConfig,
  defaultCommandTimeout: 8000,
  screenshotOnRunFailure: true,
  e2e: {
    ...baseConfig.e2e,
    retries: {
      runMode: 3
    }
  }
});
