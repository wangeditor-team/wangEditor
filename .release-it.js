module.exports = {
    git: {
        tagName: 'v${version}',
        commitMessage: 'release: v${version}',
        requireCleanWorkingDir: false,
        requireBranch: 'master',
    },
    hooks: {
        "before:init": ["git pull origin master", "npm run all-check"]
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
