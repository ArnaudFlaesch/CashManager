import { defineConfig } from "cypress";

const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

export default defineConfig({
  watchForFileChanges: false,
  viewportWidth: VIEWPORT_WIDTH,
  viewportHeight: VIEWPORT_HEIGHT,
  screenshotOnRunFailure: false,
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results/mochawesome-report",
    overwrite: false,
    html: false,
    json: true
  },
  expose: {
    backend_url: "http://localhost:8080"
  },
  e2e: {
    baseUrl: "http://localhost:4200/",
    specPattern: "cypress/e2e/*.spec.ts",
    setupNodeEvents(on) {
      // Run headless browsers at the viewport size so screenshots have the same resolution
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.isHeadless) {
          if (browser.family === "chromium" && browser.name !== "electron") {
            launchOptions.args.push(
              `--window-size=${VIEWPORT_WIDTH},${VIEWPORT_HEIGHT}`,
              "--force-device-scale-factor=1"
            );
          } else if (browser.name === "electron") {
            launchOptions.preferences.width = VIEWPORT_WIDTH;
            launchOptions.preferences.height = VIEWPORT_HEIGHT;
          } else if (browser.family === "firefox") {
            launchOptions.args.push(`--width=${VIEWPORT_WIDTH}`, `--height=${VIEWPORT_HEIGHT}`);
          }
        }
        return launchOptions;
      });
    }
  }
});
