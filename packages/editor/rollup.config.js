import { createRollupConfig, IS_PRD } from '../../build/create-rollup-config'
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

if (IS_PRD) {
  // esm
  const esmConf = createRollupConfig({
    output: {
      file: pkg.module,
      format: 'esm',
      name,
    },
  })
  configList.push(esmConf)
}

export default configList
