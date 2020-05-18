module.exports = {
    roots: ['<rootDir>/test'],
    testRegex: 'test/(.+)\\.test\\.(js?|ts?)$',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
