import path from 'path'
import { createRollupConfig, IS_PRD } from '../../build/create-rollup-config'
import pkg from './package.json'

const name = 'WangEditorForVue'
const input = path.resolve(__dirname, './src', 'index.ts')

const configList = []

// umd - 开发环境需要 CDN 引入方式来测试，所以优先输出 umd
const umdConf = createRollupConfig({
  input,
  output: {
    file: pkg.main,
    format: 'umd',
    name,
  },
})
configList.push(umdConf)

if (IS_PRD) {
  // esm
  const esmConf = createRollupConfig({
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      name,
    },
  })
  configList.push(esmConf)
}

export default configList
