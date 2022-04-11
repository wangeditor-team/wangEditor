const util = require('util')
const exec = util.promisify(require('child_process').exec)
const DEFAULT_RELEASE_COMMIT_MESSAGE = 'chore: release tag'

function command(command) {
  return exec(command, { cwd: process.cwd() })
    .then(resp => {
      const data = resp.stdout.toString()
      return Promise.resolve(data)
    })
    .catch(err => {
      throw err
    })
}

async function run(commitMsg = DEFAULT_RELEASE_COMMIT_MESSAGE) {
  const timestamp = Date.now()
  const tagName = `v${timestamp}`
  // 先打触发 publish ci 的标签
  await command(`git tag -a ${tagName} -m"${commitMsg}"`)
  // 推送标签到远程触发 ci
  await command(`git push origin ${tagName}`)
}

run()
