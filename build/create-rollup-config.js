import path from 'path'
import cleanup from 'rollup-plugin-cleanup'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const ENV = process.env.NODE_ENV || 'production'

function genSingleConfig(distDir, options) {
  const { name = 'index', format, suffix = 'js', plugins = [] } = options

  // 开发环境不压缩 css
  const postcssPlugins = ENV !== 'development' ? [autoprefixer(), cssnano()] : [autoprefixer()]

  return {
    input: path.resolve(__dirname, './src/index.ts'),
    output: {
      file: path.resolve(distDir, `${name}.${suffix}`),
      format,
      name,
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(), // 打包结果不包含 peerDependencies
      json({
        compact: true,
        indent: '  ',
        preferConst: true,
      }),
      typescript({
        clean: true,
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
      }),
      nodeResolve({
        browser: true,
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(ENV),
        // 'process.pid': JSON.stringify(process.pid.toString()),
        preventAssignment: true,
      }),
      cleanup({
        comments: 'none',
        extensions: ['.ts', '.tsx'],
      }),
      postcss({
        plugins: postcssPlugins,
        extract: 'css/style.css',
      }),
      ...plugins,
    ],
  }
}

/**
 * 获取默认的 rollup 配置
 * @param {string} distDir dirt dir
 */
export default function createDefaultRollupConfig(distDir) {
  // 非开发环境下
  if (ENV !== 'development') {
    return [
      genSingleConfig(distDir, { format: 'umd', plugins: [terser()] }),
      genSingleConfig(distDir, {
        name: 'index.module',
        format: 'es',
        suffix: 'mjs',
      }),
    ]
  }

  // 开发环境
  return genSingleConfig(distDir, { format: 'umd' })
}
