module.exports = {
  roots: ['<rootDir>/packages'],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'vue'],
  moduleNameMapper: {
    '^.+\\.(css|less)$': '<rootDir>/tests/utils/stylesMock.js',
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/index.ts'],
}
