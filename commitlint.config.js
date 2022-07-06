const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const packages = fs
  .readdirSync(path.resolve(__dirname, 'packages'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name.replace(/-modules?$/, ''))

// precomputed scope
const scopeComplete = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')
  .find(r => r.indexOf('M  ') !== -1)
  ?.replace(/(\/)/g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]
  ?.replace(/-modules?$/, '')

/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['cz'],
  rules: {
    'type-empty': [2, 'never'],
  },
  prompt: {
    scopes: [...packages],
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultScope: scopeComplete,
    allowEmptyIssuePrefixs: false,
    allowCustomIssuePrefixs: false,
    types: [
      {
        value: 'WIP',
        name: 'WIP:       💡 Work in progress',
      },
      {
        value: 'feat',
        name: 'feat:      🚀 A new feature',
      },
      {
        value: 'fix',
        name: 'fix:       🔧 A bug fix',
      },
      {
        value: 'refactor',
        name: 'refactor:  🔨 A code change that neither fixes a bug nor adds a feature',
      },
      {
        value: 'release',
        name: 'release:   🛳  Bump to a new Semantic version',
      },
      {
        value: 'docs',
        name: 'docs:      📚 Documentation only changes',
      },
      {
        value: 'test',
        name: 'test:      🔍 Add missing tests or correcting existing tests',
      },
      {
        value: 'perf',
        name: 'perf:      ⚡️ Changes that improve performance',
      },
      {
        value: 'chore',
        name: "chore:     🚬 Changes that don't modify src or test files. Such as updating build tasks, package manager",
      },
      {
        value: 'workflow',
        name: 'workflow:  📦 Changes that only affect the workflow. Such as updating build systems or CI etc.',
      },
      {
        value: 'style',
        name: 'style:     💅 Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
      },
      {
        value: 'revert',
        name: 'revert:    ⏱   Revert to a commit',
      },
    ],
  },
}
