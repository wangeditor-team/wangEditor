/*
    上传图片
*/

import { arrForEach, percentFormat } from '../../util/util.js'

// 构造函数
function UploadImg(editor) {
    this.editor = editor
}

// 原型
UploadImg.prototype = {
    constructor: UploadImg,

    // 根据 debug 弹出不同的信息
    _alert: function (alertInfo, debugInfo) {
        const editor = this.editor
        const debug = editor.config.debug

        if (debug) {
            throw new Error('wangEditor: ' + (debugInfo || alertInfo))
        } else {
            alert(alertInfo)
        }
    },

    // 根据链接插入图片
    insertLinkImg: function (link) {
        if (!link) {
            return
        }
        const editor = this.editor

        let img = document.createElement('img')
        img.onload = () => {
            img = null
            editor.cmd.do('insertHTML', `<img src="${link}" style="max-width:100%;"/>`)
        }
        img.onerror = () => {
            img = null
            // 无法成功下载图片
            this._alert('插入图片错误', `wangEditor: 插入图片出错，图片链接是 ${link} ，下载该链接失败`)
            return
        }
        img.onabort = () => {
            img = null
        }
        img.src = link
    },

    // 上传图片
    uploadImg: function (files) {
        if (!files || !files.length) {
            return
        }

        // ------------------------------ 获取配置信息 ------------------------------
        const editor = this.editor
        const config = editor.config
        const maxSize = config.uploadImgMaxSize
        const maxSizeM = maxSize / 1000 / 1000
        const uploadImgServer = config.uploadImgServer
        const uploadImgShowBase64 = config.uploadImgShowBase64
        const hooks = config.uploadImgHooks || {}
        const timeout = config.uploadImgTimeout || 3000

        // ------------------------------ 验证文件信息 ------------------------------
        const resultFiles = []
        let errInfo = []
        arrForEach(files, file => {
            var name = file.name
            var size = file.size
            if (/\.(jpg|jpeg|png|bmp|gif)$/i.test(name) === false) {
                // 后缀名不合法，不是图片
                errInfo.push(`【${name}】不是图片`)
                return
            }
            if (maxSize < size) {
                // 上传图片过大
                errInfo.push(`【${name}】大于 ${maxSizeM}M`)
                return
            }

            // 验证通过的加入结果列表
            resultFiles.push(file)
        })
        // 抛出验证信息
        if (errInfo.length) {
            this._alert('图片验证未通过: \n' + errInfo.join('\n'))
            return
        }
        // 添加图片数据
        const formdata = new FormData()
        arrForEach(resultFiles, file => {
            formdata.append(file.name, file)
        })

        // ------------------------------ 上传图片 ------------------------------
        if (uploadImgServer && typeof uploadImgServer === 'string') {
            const xhr = new XMLHttpRequest()

            // 设置超时
            xhr.timeout = timeout
            xhr.ontimeout = () => {
                // hook - timeout
                if (hooks.timeout && typeof hooks.timeout === 'function') {
                    hooks.timeout(xhr, editor)
                }

                this._alert('上传图片超时')
            }

            // 监控 progress
            if (xhr.upload) {
                xhr.upload.onprogress = e => {
                    let percent
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total
                        editor.bar.show( '上传进度: ' + percentFormat(percent) )
                        if (percent === 1) {
                            setTimeout(() => {
                                editor.bar.hide()
                            }, 1000)
                        }
                    }
                }
            }

            // 返回数据
            xhr.onreadystatechange = () => {
                let result
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.status !== 200) {
                        // hook - error
                        if (hooks.error && typeof hooks.error === 'function') {
                            hooks.error(xhr, editor)
                        }

                        // xhr 返回状态错误
                        this._alert('上传图片发生错误', `上传图片发生错误，服务器返回状态是 ${xhr.status}`)
                        return
                    }

                    result = xhr.responseText
                    if (typeof result !== 'object') {
                        try {
                            result = JSON.parse(result)
                        } catch (ex) {
                            // hook - fail
                            if (hooks.fail && typeof hooks.fail === 'function') {
                                hooks.fail(xhr, editor, result)
                            }

                            this._alert('上传图片失败', '上传图片返回结果错误，返回结果是: ' + result)
                            return
                        }
                    }
                    if (result.errno != '0') {
                        // hook - fail
                        if (hooks.fail && typeof hooks.fail === 'function') {
                            hooks.fail(xhr, editor, result)
                        }

                        // 数据错误
                        this._alert('上传图片失败', '上传图片返回结果错误，返回结果 errno=' + result.errno)
                    } else {
                        const data = result.data || []
                        data.forEach(link => {
                            this.insertLinkImg(link)
                        })

                        // hook - success
                        if (hooks.success && typeof hooks.success === 'function') {
                            hooks.success(xhr, editor, result)
                        }
                    }
                }
            }

            // hook - before
            if (hooks.before && typeof hooks.before === 'function') {
                hooks.before(xhr, editor, resultFiles)
            }

            // 发送请求
            xhr.open('POST', uploadImgServer)
            xhr.send(formdata)

            // 注意，要 return 。不去操作接下来的 base64 显示方式
            return
        }

        // 显示 base64 格式
        if (uploadImgShowBase64) {
            arrForEach(files, file => {
                const _this = this
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    _this.insertLinkImg(this.result)
                }
            })
        }
    }
}

export default UploadImg