import { defineConfig } from "cypress";
import baseConfig from "./cypress.config";

// CI configuration: same as the local one, with retries, screenshots and a JSON report
export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    retries: {
      runMode: 3
    },
    defaultCommandTimeout: 8000,
    screenshotOnRunFailure: true,
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results/mochawesome-report",
      overwrite: false,
      html: false,
      json: true
    }
  }
});
