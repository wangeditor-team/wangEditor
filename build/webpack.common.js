/**
 * @description webpack 通用配置
 * @author wangfupeng
 */

const path = require('path')
const webpack = require('webpack')
const { srcPath } = require('./myPath')

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
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
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
    ],
}
