import serve from 'rollup-plugin-serve'
import { createRollupConfig, IS_PRD, IS_DEV } from '../../build/create-rollup-config'
import pkg from './package.json'

const name = 'wangEditor'

const configList = []

const plugins = []

if (IS_DEV) {
  // serve plugin
  plugins.push(
    serve({
      open: true,
      contentBase: ['dist', 'examples'],
      port: 8881,
    })
  )
}

// umd
const umdConf = createRollupConfig({
  output: {
    file: pkg.main,
    format: 'umd',
    name,
  },
  plugins,
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
    plugins,
  })
  configList.push(esmConf)
}

export default configList
