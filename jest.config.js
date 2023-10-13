// const nextJest = require('next/jest');
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to Next.js app to load next.config.js and .env files in \test environment
  dir: './',
});


const customJestConfig = {
  // Add more setup options before each test is run

  moduleDirectories: ['node_modules', '<rootDir>/'],
  // testEnvironment: 'jest-environment-jsdom',
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@/dbConfigs/(.*)$': '<rootDir>/src/db/configs/$1',
    '^@/graphql/(.*)$': '<rootDir>/graphql/$1',
    '^@/libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@/models/(.*)$': '<rootDir>/src/models/$1',
    '^@/middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@/mutations/(.*)$': '<rootDir>/src/db/graphql/mutations/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/queries/(.*)$': '<rootDir>/src/db/graphql/queries/$1',
    '^@/schema/(.*)$': '<rootDir>/src/db/schema/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/test_resources/(.*)$': '<rootDir>/test_resources/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',

    '^.+\\.(css|less)$': '<rootDir>/src/__mocks__/CSSStub.ts',
  },
};


export default customJestConfig;
