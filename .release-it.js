module.exports = {
    git: {
        tagName: 'v${version}',
        commitMessage: 'release: v${version}',
        requireCleanWorkingDir: false,
    },
    hooks: {
        'after:bump': ['npm run build'],
    },
    npm: {
        publish: false,
    },
    prompt: {
        ghRelease: false,
        glRelease: false,
        publish: false,
    },
    plugins: {
        '@release-it/conventional-changelog': {
            preset: 'angular',
            infile: 'CHANGELOG.md',
        },
    },
}
