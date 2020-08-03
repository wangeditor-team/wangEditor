module.exports = {
    roots: ['<rootDir>/test'],
    testRegex: 'test/(.+)\\.test\\.(js?|ts?)$',
    transform: {
        '^.+\\.(css|less)$': '<rootDir>/test/fns/styleMock.js',
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
