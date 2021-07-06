import path from 'path'
import { createRollupConfig, IS_PRD } from '../../build/create-rollup-config'
import pkg from './package.json'

const name = 'WangEditorForReact'
const input = path.resolve(__dirname, './src', 'index.tsx')

const configList = []

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

if (IS_PRD) {
  // umd
  const umdConf = createRollupConfig({
    input,
    output: {
      file: pkg.main,
      format: 'umd',
      name,
    },
  })
  configList.push(umdConf)
}

export default configList
