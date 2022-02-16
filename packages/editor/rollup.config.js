import { createRollupConfig, IS_PRD, IS_DEV } from '../../build/create-rollup-config'
import pkg from './package.json'

const name = 'wangEditor'

const configList = []

// umd
const umdConf = createRollupConfig({
  output: {
    file: pkg.main,
    format: 'umd',
    name,
  },
})
configList.push(umdConf)

// esm
const esmConf = createRollupConfig({
  output: {
    file: pkg.module,
    format: 'esm',
    name,
  },
})
configList.push(esmConf)

export default configList
