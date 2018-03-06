/*
    上传图片
*/

import { objForEach, arrForEach, percentFormat } from '../../util/util.js'
import Progress from './progress.js'
import { UA } from '../../util/util.js'

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
        const customAlert = editor.config.customAlert

        if (debug) {
            throw new Error('wangEditor: ' + (debugInfo || alertInfo))
        } else {
            if (customAlert && typeof customAlert === 'function') {
                customAlert(alertInfo)
            } else {
                alert(alertInfo)
            }
        }
    },

    // 根据链接插入图片
    insertLinkImg: function (link) {
        if (!link) {
            return
        }
        const editor = this.editor
        const config = editor.config

        // 校验格式
        const linkImgCheck = config.linkImgCheck
        let checkResult
        if (linkImgCheck && typeof linkImgCheck === 'function') {
            checkResult = linkImgCheck(link)
            if (typeof checkResult === 'string') {
                // 校验失败，提示信息
                alert(checkResult)
                return
            }
        }

        editor.cmd.do('insertHTML', `<img src="${link}" style="max-width:100%;"/>`)

        // 验证图片 url 是否有效，无效的话给出提示
        let img = document.createElement('img')
        img.onload = () => {
            const callback = config.linkImgCallback
            if (callback && typeof callback === 'function') {
                callback(link)
            }

            img = null
        }
        img.onerror = () => {
            img = null
            // 无法成功下载图片
            this._alert('插入图片错误', `wangEditor: 插入图片出错，图片链接是 "${link}"，下载该链接失败`)
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
        let uploadImgServer = config.uploadImgServer
        const uploadImgShowBase64 = config.uploadImgShowBase64

        const maxSize = config.uploadImgMaxSize
        const maxSizeM = maxSize / 1024 / 1024
        const maxLength = config.uploadImgMaxLength || 10000
        const uploadFileName = config.uploadFileName || ''
        const uploadImgParams = config.uploadImgParams || {}
        const uploadImgParamsWithUrl = config.uploadImgParamsWithUrl
        const uploadImgHeaders = config.uploadImgHeaders || {}
        const hooks = config.uploadImgHooks || {}
        const timeout = config.uploadImgTimeout || 3000
        let withCredentials = config.withCredentials
        if (withCredentials == null) {
            withCredentials = false
        }
        const customUploadImg = config.customUploadImg

        if (!customUploadImg) {
            // 没有 customUploadImg 的情况下，需要如下两个配置才能继续进行图片上传
            if (!uploadImgServer && !uploadImgShowBase64) {
                return
            }
        }

        // ------------------------------ 验证文件信息 ------------------------------
        const resultFiles = []
        let errInfo = []
        arrForEach(files, file => {
            var name = file.name
            var size = file.size

            // chrome 低版本 name === undefined
            if (!name || !size) {
                return
            }

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
        if (resultFiles.length > maxLength) {
            this._alert('一次最多上传' + maxLength + '张图片')
            return
        }

        // ------------------------------ 自定义上传 ------------------------------
        if (customUploadImg && typeof customUploadImg === 'function') {
            customUploadImg(resultFiles, this.insertLinkImg.bind(this))

            // 阻止以下代码执行
            return
        }

        // 添加图片数据
        const formdata = new FormData()
        arrForEach(resultFiles, file => {
            const name = uploadFileName || file.name
            formdata.append(name, file)
        })

        // ------------------------------ 上传图片 ------------------------------
        if (uploadImgServer && typeof uploadImgServer === 'string') {
            // 添加参数
            const uploadImgServerArr = uploadImgServer.split('#')
            uploadImgServer = uploadImgServerArr[0]
            const uploadImgServerHash = uploadImgServerArr[1] || ''
            objForEach(uploadImgParams, (key, val) => {
                val = encodeURIComponent(val)

                // 第一，将参数拼接到 url 中
                if (uploadImgParamsWithUrl) {
                    if (uploadImgServer.indexOf('?') > 0) {
                        uploadImgServer += '&'
                    } else {
                        uploadImgServer += '?'
                    }
                    uploadImgServer = uploadImgServer + key + '=' + val
                }

                // 第二，将参数添加到 formdata 中
                formdata.append(key, val)
            })
            if (uploadImgServerHash) {
                uploadImgServer += '#' + uploadImgServerHash
            }

            // 定义 xhr
            const xhr = new XMLHttpRequest()
            xhr.open('POST', uploadImgServer)

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
                    // 进度条
                    const progressBar = new Progress(editor)
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total
                        progressBar.show(percent)
                    }
                }
            }

            // 返回数据
            xhr.onreadystatechange = () => {
                let result
                if (xhr.readyState === 4) {
                    if (xhr.status < 200 || xhr.status >= 300) {
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
                    if (!hooks.customInsert && result.errno != '0') {
                        // hook - fail
                        if (hooks.fail && typeof hooks.fail === 'function') {
                            hooks.fail(xhr, editor, result)
                        }

                        // 数据错误
                        this._alert('上传图片失败', '上传图片返回结果错误，返回结果 errno=' + result.errno)
                    } else {
                        if (hooks.customInsert && typeof hooks.customInsert === 'function') {
                            // 使用者自定义插入方法
                            hooks.customInsert(this.insertLinkImg.bind(this), result, editor)
                        } else {
                            // 将图片插入编辑器
                            const data = result.data || []
                            data.forEach(link => {
                                this.insertLinkImg(link)
                            })
                        }

                        // hook - success
                        if (hooks.success && typeof hooks.success === 'function') {
                            hooks.success(xhr, editor, result)
                        }
                    }
                }
            }

            // hook - before
            if (hooks.before && typeof hooks.before === 'function') {
                const beforeResult = hooks.before(xhr, editor, resultFiles)
                if (beforeResult && typeof beforeResult === 'object') {
                    if (beforeResult.prevent) {
                        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                        this._alert(beforeResult.msg)
                        return
                    }
                }
            }

            // 自定义 headers
            objForEach(uploadImgHeaders, (key, val) => {
                xhr.setRequestHeader(key, val)
            })

            // 跨域传 cookie
            xhr.withCredentials = withCredentials

            // 发送请求
            xhr.send(formdata)

            // 注意，要 return 。不去操作接下来的 base64 显示方式
            return
        }

        // ------------------------------ 显示 base64 格式 ------------------------------
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