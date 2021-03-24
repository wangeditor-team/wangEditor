/**
 * @description webpack 通用配置
 * @author wangfupeng
 */

const path = require('path')
const webpack = require('webpack')
const { srcPath } = require('./myPath')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    entry: {
        wangEditor: path.join(srcPath, 'wangEditor.ts'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['babel-loader', 'ts-loader'],
                include: /src/,
            },
            {
                test: /\.(less|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 500 * 1024, // <=500kb 则使用 base64 （即，希望字体文件一直使用 base64 ，而不单独打包）
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.less', '.css'],
        alias: {
            // utils: path.join(srcPath, 'utils'),
            // style: path.join(srcPath, 'assets', 'style'),
            // '@': srcPath,
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify('dev1'),
            ENV1: JSON.stringify(process.env.NODE_ENV),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.css',
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
    },
}
