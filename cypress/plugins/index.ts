/// <reference types="cypress" />

/** Resolution of the browser window and of the viewport of the tests. */
export const VIEWPORT = { width: 1920, height: 1080 };

/** Launches the headless browsers at the resolution of the viewport. */
export function displayBrowserInFullSize(
  browser: Cypress.Browser,
  launchOptions: Cypress.BeforeBrowserLaunchOptions
): Cypress.BeforeBrowserLaunchOptions {
  console.log("launching browser %s is headless? %s", browser.name, browser.isHeadless);

  // Screenshots and videos are taken at this resolution
  const { width, height } = VIEWPORT;

  console.log("setting the browser window size to %d x %d", width, height);

  if (browser.name === "chrome" && browser.isHeadless) {
    launchOptions.args.push(`--window-size=${width},${height}`);

    // force screen to be non-retina and just use our given resolution
    launchOptions.args.push("--force-device-scale-factor=1");
  }

  if (browser.name === "electron" && browser.isHeadless) {
    // might not work on CI for some reason
    launchOptions.preferences.width = width;
    launchOptions.preferences.height = height;
  }

  if (browser.name === "firefox" && browser.isHeadless) {
    launchOptions.args.push(`--width=${width}`, `--height=${height}`);
  }

  // IMPORTANT: return the updated browser launch options
  return launchOptions;
}
