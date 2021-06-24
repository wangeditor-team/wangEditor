import path from 'path'
import createDefaultRollupConfig from '../../build/create-rollup-config'

const distDir = path.resolve(__dirname, './dist')

const conf = createDefaultRollupConfig('WangEditor', distDir)

export default conf
