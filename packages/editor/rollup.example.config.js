import serve from 'rollup-plugin-serve'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { createRollupConfig } from '../../build/create-rollup-config'
import pkg from './package.json'

const name = 'wangEditor'

const config = createRollupConfig({
  output: {
    file: pkg.main,
    format: 'umd',
    name,
  },
  plugins: [
    // TODO 使用 serve 插件之后，会丢失原有的 postcss 插件，原因不明。此处先暂时重复写一遍
    postcss({
      plugins: [autoprefixer()],
      extract: 'css/style.css',
    }),
    serve({
      // open: true,
      contentBase: ['dist', 'examples'],
      port: 8881,
    }),
  ],
})

export default config
