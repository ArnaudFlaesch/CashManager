import presets from 'jest-preset-angular/presets';
import { type JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  ...presets.createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['./cypress/', 'node_modules/date-fns'],
  collectCoverage: true,
  moduleNameMapper: {
    'ng2-charts': '<rootDir>/node_modules/ng2-charts/fesm2022/ng2-charts.mjs',
    '^lodash-es$': 'lodash',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })
  },
  coverageDirectory: 'coverage-jest/'
} satisfies JestConfigWithTsJest;
