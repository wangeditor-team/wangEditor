module.exports = {
  roots: ['<rootDir>/packages'],
  testEnvironment: 'jsdom',
  testMatch: ['**/(*.)+(spec|test).+(ts|js)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less)$': '<rootDir>/tests/utils/stylesMock.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/index.ts'],
}
