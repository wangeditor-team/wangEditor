import path from 'path'
import createRollupConfig from '../../build/create-rollup-config'

const distDir = path.resolve(__dirname, './dist')
const name = 'WangEditorVideoModule'

const configList = createRollupConfig(distDir, name)

export default configList
