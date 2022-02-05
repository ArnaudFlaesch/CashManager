// eslint-disable-next-line no-undef
module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./setup-jest.ts"],
  testPathIgnorePatterns: ["./cypress/"],
  collectCoverage: true,
  coverageDirectory: "coverage-jest/",
  globalSetup: "jest-preset-angular/global-setup",
};
