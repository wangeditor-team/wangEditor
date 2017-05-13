const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const util  = require('./util.js')

const koa = require('koa')
const app = koa()

// 捕获错误
const onerror = require('koa-onerror')
onerror(app)

// post body 解析
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 静态文件服务，针对 html js css fonts 文件
const staticCache = require('koa-static-cache')
function setStaticCache() {
    const exampleDir = path.join(__dirname, '..', '..', 'example')
    const releaseDir = path.join(__dirname, '..', '..', 'release')
    app.use(staticCache(exampleDir))
    app.use(staticCache(releaseDir))
}
setStaticCache()

// 配置路由
const router = require('koa-router')()

// 保存上传的文件
function saveFiles(req) {
    return new Promise((resolve, reject) => {
        const imgLinks = []
        const form = new formidable.IncomingForm()
        form.parse(req, function (err, fields, files) {
            if (err) {
                reject('formidable, form.parse err', err.stack)
            }
            // 存储图片的文件夹
            const storePath = path.resolve(__dirname, '..', 'upload-files')
            if (!fs.existsSync(storePath)) {
                fs.mkdirSync(storePath)
            }

            // 遍历所有上传来的图片
            util.objForEach(files, (name, file) => {
                // 图片临时位置
                const tempFilePath = file.path
                // 图片名称和路径
                const fileName = file.name
                const fullFileName = path.join(storePath, fileName)
                // 将临时文件保存为正式文件
                fs.renameSync(tempFilePath, fullFileName)
                // 存储链接
                imgLinks.push('/upload-files/' + fileName)
            })

            // 重新设置静态文件缓存
            setStaticCache()

            // 返回结果
            resolve({
                errno: 0,
                data: imgLinks
            })
        })
    })
}

// 上传图片
router.post('/upload-img', function* () {
    const ctx = this
    const req = ctx.req
    const res = ctx.res

    // 获取数据
    const data = yield saveFiles(req)

    // 返回结果
    this.body = JSON.stringify(data)
})
app.use(router.routes()).use(router.allowedMethods());

// 启动服务
app.listen(3000)
console.log('listening on port %s', 3000)

module.exports = app