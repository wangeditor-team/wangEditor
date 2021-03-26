/**
 * @description webpack 配置，生产环境
 * @author wangfupeng
 */

// const path = require('path')
const { smart } = require('webpack-merge')
const CommonConf = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { distPath } = require('./myPath')

// 包体积分析
const isAnalyzer = process.env.NODE_ENV === 'production_analyzer'

const plugins = [new CleanWebpackPlugin()]
if (isAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin())
}

module.exports = smart(CommonConf, {
    mode: 'production',
    output: {
        filename: '[name].min.js',
        path: distPath,
        library: 'wangEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    plugins,
    devtool: 'source-map',
})
