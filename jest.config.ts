import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  testMatch: ['<rootDir>/modules/**/test/**/*.spec.ts'],
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
  collectCoverageFrom: [
    '<rootDir>/modules/**/src/**/*.ts',
    '!**/*.spec.ts',
    '!**/*.dto.ts',
    '!**/*.tokens.ts',
    '!**/*.mocks.ts',
    '!**/*module.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
};

export default config;
