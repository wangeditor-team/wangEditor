import path from 'path'
import createDefaultRollupConfig from '../../build/create-rollup-config'

const distDir = path.resolve(__dirname, './dist')

const conf = createDefaultRollupConfig('WangEditorCore', distDir)

export default conf
