/**
 * @description 上传图片
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { arrForEach, forEach } from '../../utils/util'
import post from '../../editor/upload/upload-core'
import Progress from '../../editor/upload/progress'

type ResType = {
    errno: number | string
    data: string[]
}

class UploadImg {
    private editor: Editor

    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * 提示信息
     * @param alertInfo alert info
     * @param debugInfo debug info
     */
    private alert(alertInfo: string, debugInfo?: string): void {
        const customAlert = this.editor.config.customAlert
        if (customAlert) {
            customAlert(alertInfo)
        } else {
            window.alert(alertInfo)
        }

        if (debugInfo) {
            console.error('wangEditor: ' + debugInfo)
        }
    }

    /**
     * 往编辑区域插入图片
     * @param src 图片地址
     */
    public insertImg(src: string): void {
        const editor = this.editor
        const config = editor.config

        // 先插入图片，无论是否能成功
        editor.cmd.do('insertHTML', `<img src="${src}" style="max-width:100%;"/>`)
        // 执行回调函数
        config.linkImgCallback(src)

        // 加载图片
        let img: any = document.createElement('img')
        img.onload = () => {
            img = null
        }
        img.onerror = () => {
            this.alert(
                '插入图片出错',
                `wangEditor: 插入图片出错，图片链接是 "${src}"，下载该链接失败`
            )
            img = null
        }
        img.onabort = () => (img = null)
        img.src = src
    }

    /**
     * 上传图片
     * @param files 文件列表
     */
    public uploadImg(files: FileList): void {
        if (!files.length) {
            return
        }

        const editor = this.editor
        const config = editor.config

        // ------------------------------ 获取配置信息 ------------------------------

        // 服务端地址
        let uploadImgServer = config.uploadImgServer
        // base64 格式
        const uploadImgShowBase64 = config.uploadImgShowBase64
        // 图片最大体积
        const maxSize = config.uploadImgMaxSize
        const maxSizeM = maxSize / 1024 / 1024
        // 一次最多上传图片数量
        const maxLength = config.uploadImgMaxLength
        // 自定义 fileName
        const uploadFileName = config.uploadFileName
        // 自定义参数
        const uploadImgParams = config.uploadImgParams
        // 参数拼接到 url 中
        const uploadImgParamsWithUrl = config.uploadImgParamsWithUrl
        // 自定义 header
        const uploadImgHeaders = config.uploadImgHeaders
        // 钩子函数
        const hooks = config.uploadImgHooks
        // 上传图片超时时间
        const timeout = config.uploadImgTimeout
        // 跨域带 cookie
        const withCredentials = config.withCredentials
        // 自定义上传图片
        const customUploadImg = config.customUploadImg

        if (!customUploadImg) {
            // 没有 customUploadImg 的情况下，需要如下两个配置才能继续进行图片上传
            if (!uploadImgServer && !uploadImgShowBase64) {
                return
            }
        }

        // ------------------------------ 验证文件信息 ------------------------------
        const resultFiles: File[] = []
        const errInfos: string[] = []
        arrForEach(files, (file: File) => {
            const name = file.name
            const size = file.size

            // chrome 低版本 name === undefined
            if (!name || !size) {
                return
            }

            if (/\.(jpg|jpeg|png|bmp|gif|webp)$/i.test(name) === false) {
                // 后缀名不合法，不是图片
                errInfos.push(`【${name}】不是图片`)
                return
            }

            if (maxSize < size) {
                // 上传图片过大
                errInfos.push(`【${name}】大于 ${maxSizeM}M`)
                return
            }

            // 验证通过的加入结果列表
            resultFiles.push(file)
        })
        // 抛出验证信息
        if (errInfos.length) {
            this.alert('图片验证未通过: \n' + errInfos.join('\n'))
            return
        }
        if (resultFiles.length > maxLength) {
            this.alert('一次最多上传' + maxLength + '张图片')
            return
        }

        // ------------------------------ 自定义上传 ------------------------------
        if (customUploadImg && typeof customUploadImg === 'function') {
            customUploadImg(resultFiles, this.insertImg.bind(this))

            // 阻止以下代码执行，重要！！！
            return
        }

        // ------------------------------ 上传图片 ------------------------------

        // 添加图片数据
        const formData = new FormData()
        resultFiles.forEach((file: File, index: number) => {
            let name = uploadFileName || file.name
            if (resultFiles.length > 1) {
                // 多个文件时，filename 不能重复
                name = name + (index + 1)
            }
            formData.append(name, file)
        })
        if (uploadImgServer) {
            // 添加自定义参数
            const uploadImgServerArr = uploadImgServer.split('#')
            uploadImgServer = uploadImgServerArr[0]
            const uploadImgServerHash = uploadImgServerArr[1] || ''
            forEach(uploadImgParams, (key: string, val: string) => {
                // 因使用者反应，自定义参数不能默认 encode ，由 v3.1.1 版本开始注释掉
                // val = encodeURIComponent(val)

                // 第一，将参数拼接到 url 中
                if (uploadImgParamsWithUrl) {
                    if (uploadImgServer.indexOf('?') > 0) {
                        uploadImgServer += '&'
                    } else {
                        uploadImgServer += '?'
                    }
                    uploadImgServer = uploadImgServer + key + '=' + val
                }

                // 第二，将参数添加到 formData 中
                formData.append(key, val)
            })
            if (uploadImgServerHash) {
                uploadImgServer += '#' + uploadImgServerHash
            }

            // 开始上传
            const xhr = post(uploadImgServer, {
                timeout,
                formData,
                headers: uploadImgHeaders,
                withCredentials: !!withCredentials,
                beforeSend: (xhr: XMLHttpRequest) => {
                    if (hooks.before) return hooks.before(xhr, editor, resultFiles)
                },
                onTimeout: (xhr: XMLHttpRequest) => {
                    this.alert('上传图片超时')
                    if (hooks.timeout) hooks.timeout(xhr, editor)
                },
                onProgress: (percent: number, e: ProgressEvent) => {
                    const progressBar = new Progress(editor)
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total
                        progressBar.show(percent)
                    }
                },
                onError: (xhr: XMLHttpRequest) => {
                    this.alert(
                        '上传图片发生错误',
                        `上传图片发生错误，服务器返回状态是 ${xhr.status}`
                    )
                    if (hooks.error) hooks.error(xhr, editor)
                },
                onFail: (xhr: XMLHttpRequest, resultStr: string) => {
                    this.alert('上传图片失败', '上传图片返回结果错误，返回结果是: ' + resultStr)
                    if (hooks.fail) hooks.fail(xhr, editor, resultStr)
                },
                onSuccess: (xhr: XMLHttpRequest, result: ResType) => {
                    if (hooks.customInsert) {
                        // 自定义插入图片
                        hooks.customInsert(this.insertImg.bind(this), result, editor)
                        return
                    }
                    if (result.errno != '0') {
                        // 返回格式不对，应该为 { errno: 0, data: [...] }
                        this.alert(
                            '上传图片失败',
                            `上传图片返回结果错误，返回结果 errno=${result.errno}`
                        )
                        if (hooks.fail) hooks.fail(xhr, editor, result)
                        return
                    }

                    // 成功，插入图片
                    const data = result.data
                    data.forEach(link => {
                        this.insertImg(link)
                    })

                    // 钩子函数
                    if (hooks.success) hooks.success(xhr, editor, result)
                },
            })
            if (typeof xhr === 'string') {
                // 上传被阻止
                this.alert(xhr)
            }

            // 阻止以下代码执行，重要！！！
            return
        }

        // ------------------------------ 显示 base64 格式 ------------------------------
        if (uploadImgShowBase64) {
            arrForEach(files, (file: File) => {
                const _this = this
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    if (!this.result) return
                    _this.insertImg(this.result.toString())
                }
            })
        }
    }
}

export default UploadImg
