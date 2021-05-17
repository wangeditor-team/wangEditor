module.exports = {
  roots: [
    "<rootDir>/packages"
  ],
  preset: 'ts-jest',
  testMatch: [
    "**/__tests__/**/(*.)+(spec|test).+(ts|js)"
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
