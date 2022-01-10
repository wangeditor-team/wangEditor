module.exports = {
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jsdom',
  testMatch: ['**/(*.)+(spec|test).+(ts|js|tsx)'],
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
  transformIgnorePatterns: ['node_modules/(?!(html-void-elements)/)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/index.ts'],
  collectCoverageFrom: ['<rootDir>/packages/**/src/**/*.(ts|tsx)'],
}
