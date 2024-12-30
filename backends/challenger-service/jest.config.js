// Jest config: https://jestjs.io/docs/configuration

// eslint-disable-next-line no-undef
module.exports = {
  // Automatically reset mock state before every test
  resetMocks: true,

  // Automatically restore mock state and implementation before every test
  restoreMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['<rootDir>/src/test/jestHooks/setEnvVars.ts'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    '<rootDir>/src/test/jestHooks/addEqualityTesters.ts',
    '<rootDir>/src/test/jestHooks/globalHooks.ts',
  ],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 5,

  // Make absolute imports work in jest tests
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
}
