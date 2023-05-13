// eslint-disable-next-line no-undef
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./setup-jest.ts'],
  testPathIgnorePatterns: ['./cypress/', 'node_modules/date-fns'],
  collectCoverage: true,
  moduleNameMapper: {
    'ng2-charts': '<rootDir>/node_modules/ng2-charts/fesm2020/ng2-charts.mjs'
  },
  coverageDirectory: 'coverage-jest/'
};
