/**
 * @description 保存上传的文件
 * @author wangfupeng
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty')
const { objForEach } = require('../util')
const FILE_FOLDER = 'upload-files'
const isWindows = os.type().toLowerCase().indexOf('windows') >= 0
const TMP_FOLDER = 'upload-files-tmp'
const fse = require('fs-extra');

/**
 * 获取随机数
 */
function getRandom() {
    return Math.random().toString(36).slice(-3)
}

/**
 * 给文件名加后缀，如 a.png 转换为 a-123123.png
 * @param {string} fileName 文件名
 */
function genRandomFileName(fileName = '') {
    // 如 fileName === 'a.123.png'

    const r = getRandom()
    if (!fileName) return r

    const length = fileName.length // 9
    const pointLastIndexOf = fileName.lastIndexOf('.') // 5
    if (pointLastIndexOf < 0) return `${fileName}-${r}`

    const fileNameWithOutExt = fileName.slice(0, pointLastIndexOf) // "a.123"
    const ext = fileName.slice(pointLastIndexOf + 1, length) // "png"
    return `${fileNameWithOutExt}-${r}.${ext}`
}

/**
 * 保存上传的文件
 * @param {Object} req request
 */
function saveFiles(req) {
    return new Promise((resolve, reject) => {
        const videoLinks = []
        const multipart = new multiparty.Form();

        // windows 系统，处理 rename 报错
        if (isWindows) {
            const tmpPath = path.resolve(__dirname, '..', '..', TMP_FOLDER) // 在根目录下
            if (!fs.existsSync(tmpPath)) {
                fs.mkdirSync(tmpPath)
            }

        }

        multipart.parse(req, function (err, fields, files) {
            if (err) {
                reject('formidable, form.parse err', err.stack)
            }
            // 存储视频的文件夹
            const storePath = path.resolve(__dirname, '..', FILE_FOLDER)
            if (!fs.existsSync(storePath)) {
                fs.mkdirSync(storePath)
            }

            // 遍历所有上传来的视频
            objForEach(files, async (name, file) => {
                console.log('name...', name)
                console.log('file.path...', file)
                // 视频临时位置
                const tempFilePath = file[0].path
                console.log('tempFilePath...', tempFilePath)
                // 视频名称和路径
                const fileName = genRandomFileName(name) // 为文件名增加一个随机数，防止同名文件覆盖
                console.log('fileName...', fileName)
                const fullFileName = path.join(storePath, fileName)
                console.log('fullFileName...', fullFileName)
                // 将临时文件保存为正式文件
                fse.moveSync(tempFilePath, fullFileName);
                // 存储链接
                const url = `/server/${FILE_FOLDER}/` + fileName
                console.log('url...', url)
                videoLinks.push(url)
            })
            console.log('videoLinks...', videoLinks)

            // 返回结果
            resolve({
                errno: 0,
                data: {
                    url: videoLinks[0]
                },
            })
        })
    })
}

module.exports = saveFiles
