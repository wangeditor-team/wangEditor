module.exports = {
  roots: ['<rootDir>/packages'],
  testEnvironment: 'jsdom',
  testMatch: ['**/(*.)+(spec|test).+(ts|js|tsx)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less)$': '<rootDir>/tests/utils/stylesMock.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(html-void-elements)/)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/index.ts'],
  collectCoverageFrom: ['<rootDir>/packages/**/src/**/*.(ts|tsx)'],
  coveragePathIgnorePatterns: [
    'dist',
    'locale',
    'index.ts',
    'config.ts',
    'browser-polyfill.ts',
    'node-polyfill.ts',
  ],
}
