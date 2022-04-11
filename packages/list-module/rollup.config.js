import { createRollupConfig, IS_PRD } from '../../build/create-rollup-config'
import pkg from './package.json'

const name = 'WangEditorListModule'

const configList = []

// esm - 开发环境不需要 CDN 引入，只需要 npm 引入，所以优先输出 esm
const esmConf = createRollupConfig({
  output: {
    file: pkg.module,
    format: 'esm',
    name,
  },
})
configList.push(esmConf)

// umd
const umdConf = createRollupConfig({
  output: {
    file: pkg.main,
    format: 'umd',
    name,
  },
})
configList.push(umdConf)

export default configList
