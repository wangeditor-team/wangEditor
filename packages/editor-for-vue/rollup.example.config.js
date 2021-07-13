import path from 'path'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import serve from 'rollup-plugin-serve'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import { createRollupConfig } from '../../build/create-rollup-config'

// 继续生成 rollup config
const name = 'WangEditorForVue'
const input = path.resolve(__dirname, './example', 'index.ts')
const file = 'dist-example/index.js'
const port = 8883

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
    del({ targets: 'dist-example/*' }),
    copy({
      // 将 packages/editor/dist 拷贝到 dist-example
      targets: [{ src: '../editor/dist/*', dest: 'dist-example/editor-dist' }],
    }),
  ],
})

export default config
