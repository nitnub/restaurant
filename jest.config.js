// const nextJest = require('next/jest');
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // const createJestConfig = jest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
// const customJestConfig = {
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
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

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// module.exports = createJestConfig(customJestConfig);

export default customJestConfig;
