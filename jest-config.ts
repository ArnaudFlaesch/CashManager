import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const jestConfig = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['./cypress/', 'node_modules/date-fns'],
  collectCoverage: true,
  moduleNameMapper: {
    'ng2-charts': '<rootDir>/node_modules/ng2-charts/fesm2022/ng2-charts.mjs',
    '^lodash-es$': 'lodash',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })
  },
  coverageDirectory: 'coverage-jest/'
};

export default jestConfig;
