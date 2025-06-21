/// <reference types="cypress" />

module.exports = (on, config): unknown => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // let's increase the browser window size when running headlessly
  // this will produce higher resolution images and videos
  // https://on.cypress.io/browser-launch-api

  on('before:browser:launch', (browser: Cypress.Browser, launchOptions) => {
    // the browser width and height we want to get
    // our screenshots and videos will be of that resolution
    const width = 1920;
    const height = 1080;

    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`);

      // force screen to be non-retina and just use our given resolution
      launchOptions.args.push('--force-device-scale-factor=1');
    }

    if (browser.name === 'electron' && browser.isHeadless) {
      // might not work on CI for some reason
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
    }

    if (browser.name === 'firefox' && browser.isHeadless) {
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
    }

    // IMPORTANT: return the updated browser launch options
    return launchOptions;
  });

  return config;
};
