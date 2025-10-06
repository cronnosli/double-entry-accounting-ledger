import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@accounts/(.*)$': '<rootDir>/modules/accounts/src/$1',
    '^@transactions/(.*)$': '<rootDir>/modules/transactions/src/$1',
  },
  verbose: true,
  collectCoverage: false,
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 15000,
};

export default config;
