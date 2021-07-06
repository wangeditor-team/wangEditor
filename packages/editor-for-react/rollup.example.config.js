import path from 'path'
import fse from 'fs-extra'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import serve from 'rollup-plugin-serve'
import { createRollupConfig } from '../../build/create-rollup-config'

// 把 editor/dist 拷贝过来，因为本项目 peerDependencies @wangeditor/editor
const editorSource = path.resolve(__dirname, '..', 'editor', 'dist')
const distPath = path.resolve(__dirname, 'dist-example')
const editorDist = path.resolve(distPath, 'editor-dist')
fse.ensureDirSync(distPath)
fse.copySync(editorSource, editorDist, { overwrite: true })

// 继续生成 rollup config
const name = 'WangEditorForReact'
const input = path.resolve(__dirname, './example', 'index.tsx')
const file = 'dist-example/index.js'
const port = 8882

const config = createRollupConfig({
  input,
  output: {
    file,
    format: 'umd',
    name,
  },
  plugins: [
    serve({
      // open: true,
      contentBase: ['dist-example'],
      port,
      onListening: function () {
        console.log(`Example is running on http://localhost:${port}/`)
      },
    }),
    htmlTemplate({
      template: 'example/index.html',
      target: 'dist-example/index.html',
    }),
  ],
})

export default config
