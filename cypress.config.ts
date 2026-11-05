import { defineConfig } from "cypress";
import { displayBrowserInFullSize, VIEWPORT } from "./cypress/plugins";

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", displayBrowserInFullSize);
    },
    baseUrl: "http://localhost:4200/",
    specPattern: "cypress/e2e/**/*.spec.ts",
    watchForFileChanges: false,
    viewportWidth: VIEWPORT.width,
    viewportHeight: VIEWPORT.height,
    screenshotOnRunFailure: false,
    expose: {
      backend_url: "http://localhost:8080"
    }
  }
});
