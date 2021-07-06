import path from 'path'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import serve from 'rollup-plugin-serve'
import { createRollupConfig } from '../../build/create-rollup-config'

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
