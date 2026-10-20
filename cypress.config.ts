import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  watchForFileChanges: false,
  defaultCommandTimeout: 4000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  screenshotOnRunFailure: false,
  video: false,
  videoCompression: false,
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results/mochawesome-report",
    overwrite: false,
    html: false,
    json: true
  },
  env: {
    backend_url: "localhost:8080"
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "http://localhost:4200/",
    specPattern: "cypress/e2e/*.spec.ts"
  }
});
