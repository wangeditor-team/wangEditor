/**
 * @description upload-img test
 * @author luochao
 */

import createEditor from '../../../helpers/create-editor'
import mockCmdFn from '../../../helpers/command-mock'
import mockFile from '../../../helpers/mock-file'
import mockXHR from '../../../helpers/mock-xhr'
import UploadImg from '../../../../src/menus/img/upload-img'

let id = 1

const imgUrl = 'http://www.wangeditor.com/imgs/logo.jpeg'
const errorUrl = 'error.jpeg'
const uploadImgServer = 'http://localhost:8881/api/upload-img'
const uploadImgServerWithHash = 'http://localhost:8881/api/upload-img#/123'

const defaultRes = {
    status: 200,
    res: JSON.stringify({ data: ['url1'], errno: 0 }),
}

const mockXHRHttpRequest = (res: any = defaultRes) => {
    const mockXHRObject = mockXHR(res)

    const mockObject = jest.fn().mockImplementation(() => mockXHRObject)

    // @ts-ignore
    window.XMLHttpRequest = mockObject

    return mockXHRObject
}

const createUploadImgInstance = (config: any = {}) => {
    const editor = createEditor(document, `div${id++}`, '', config)
    const uploadImg = new UploadImg(editor)
    return uploadImg
}

const mockSupportCommand = () => {
    mockCmdFn(document)
    document.queryCommandSupported = jest.fn(() => true)
}

const defaultFiles = [{ name: 'test.png', size: 512, mimeType: 'image/png' }]
const createMockFiles = (fileList: any[] = defaultFiles) => {
    const files = fileList.map(file => mockFile(file))
    return files.filter(Boolean)
}

// mock img onload and onerror event
const mockImgOnloadAndOnError = () => {
    // Mocking Image.prototype.src to call the onload or onerror
    // callbacks depending on the src passed to it
    // @ts-ignore
    Object.defineProperty(global.Image.prototype, 'src', {
        // Define the property setter
        set(src) {
            if (src === errorUrl) {
                // Call with setTimeout to simulate async loading
                setTimeout(() => this.onerror(new Error('mocked error')))
            } else if (src === imgUrl) {
                setTimeout(() => this.onload())
            }
        },
    })
}

describe('upload img', () => {
    beforeAll(() => {
        // mock img onload and onerror event
        mockImgOnloadAndOnError()
    })

    test('调用 insertImg 可以网编辑器里插入图片', () => {
        const uploadImg = createUploadImgInstance()

        mockSupportCommand()

        uploadImg.insertImg(imgUrl)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<img src="${imgUrl}" style="max-width:100%;"/>`
        )
    })

    test('调用 insertImg 可以网编辑器里插入图片，可以监听插入图片回调', () => {
        const callback = jest.fn()

        const uploadImg = createUploadImgInstance({
            linkImgCallback: callback,
        })

        mockSupportCommand()

        uploadImg.insertImg(imgUrl)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<img src="${imgUrl}" style="max-width:100%;"/>`
        )
        expect(callback).toBeCalledWith(imgUrl, undefined, undefined)
    })

    test('调用 insertImg 可以网编辑器里插入图片，插入图片加载失败可以通过customAlert配置错误提示', done => {
        expect.assertions(1)

        const alertFn = jest.fn()

        const uploadImg = createUploadImgInstance({ customAlert: alertFn })

        mockSupportCommand()

        uploadImg.insertImg(errorUrl)

        setTimeout(() => {
            expect(alertFn).toBeCalledWith(
                '插入图片错误',
                'error',
                `wangEditor: 插入图片错误，图片链接 "${errorUrl}"，下载链接失败`
            )
            done()
        }, 200)
    })

    test('可以调用 uploadImg 上传图片', done => {
        expect.assertions(1)

        const jestFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                success: jestFn,
            },
        })

        const files = createMockFiles()
        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(jestFn).toBeCalled()
            done()
        }, 1000)
    })

    test('调用 uploadImg 上传图片，如果传入的文件为空直接返回 undefined，不执行上传操作', () => {
        const upload = createUploadImgInstance()

        const res = upload.uploadImg([])

        expect(res).toBeUndefined()
    })

    test('调用 uploadImg 上传图片，如果没有配置customUploadImg, 则必须配置 uploadImgServer 或者 uploadImgShowBase64，否则直接返回', () => {
        const upload = createUploadImgInstance()
        const files = createMockFiles()

        const res = upload.uploadImg(files)

        expect(res).toBeUndefined()
    })

    test('调用 uploadImg 上传图片，如果文件没有名字或者size为0，则会弹窗警告', () => {
        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            customAlert: fn,
        })

        const files = createMockFiles([{ name: '', size: 0, mimeType: 'image/png' }])

        upload.uploadImg(files)

        expect(fn).toBeCalledWith('传入的文件不合法', 'warning')
    })

    test('调用 uploadImg 上传图片，如果文件非图片，则提示错误信息', () => {
        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            customAlert: fn,
        })

        const files = createMockFiles([{ name: 'test.txt', size: 200, mimeType: 'text/plain' }])

        upload.uploadImg(files)

        expect(fn).toBeCalledWith('图片验证未通过: \n【test.txt】不是图片', 'warning')
    })

    test('调用 uploadImg 上传图片，如果文件体积大小超过配置的大小，则提示错误信息', () => {
        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgMaxSize: 5 * 1024 * 1024,
            customAlert: fn,
        })

        const files = createMockFiles([
            { name: 'test.png', size: 6 * 1024 * 1024, mimeType: 'image/png' },
        ])

        upload.uploadImg(files)

        expect(fn).toBeCalledWith(`图片验证未通过: \n【test.png】大于 5M`, 'warning')
    })

    test('调用 uploadImg 上传图片，如果文件个数超过配置的的大小，则返回并提示错误信息', () => {
        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgMaxLength: 2,
            customAlert: fn,
        })

        const files = createMockFiles([
            { name: 'test1.png', size: 2048, mimeType: 'image/png' },
            { name: 'test2.png', size: 2048, mimeType: 'image/png' },
            { name: 'test3.png', size: 2048, mimeType: 'image/png' },
        ])

        upload.uploadImg(files)

        expect(fn).toBeCalledWith('一次最多上传2张图片', 'warning')
    })

    test('调用 uploadImg 上传图片，如果配置了 customUploadImg 选项，则调用 customUploadImg 上传', () => {
        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            customUploadImg: fn,
        })

        const files = createMockFiles()

        upload.uploadImg(files)

        expect(fn).toBeCalled()
    })

    test('调用 uploadImg 上传图片，如果配置了 uploadImgParamsWithUrl 为true， 则允许添加query参数', done => {
        expect.assertions(1)

        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgParams: {
                a: 'a',
                b: 'b',
            },
            uploadImgParamsWithUrl: true,
            uploadImgHooks: {
                success: fn,
            },
        })

        const files = createMockFiles()

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(mockXHRObject.open).toHaveBeenCalledWith('POST', `${uploadImgServer}?a=a&b=b`)
            done()
        })
    })

    test('调用 uploadImg 上传图片，uploadImgServer支持 hash query 参数拼接', done => {
        expect.assertions(1)

        const fn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer: uploadImgServerWithHash,
            uploadImgParams: {
                a: 'a',
                b: 'b',
            },
            uploadImgParamsWithUrl: true,
            uploadImgHooks: {
                success: fn,
            },
        })

        const files = createMockFiles([{ name: 'test1.png', size: 2048, mimeType: 'image/png' }])

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(mockXHRObject.open).toHaveBeenCalledWith(
                'POST',
                `${uploadImgServer}?a=a&b=b#/123`
            )
            done()
        })
    })

    test('调用 uploadImg 上传图片失败，支持配置 onError 钩子监听', done => {
        expect.assertions(1)

        const errorFn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                error: errorFn,
            },
            customAlert: alertFn,
        })
        const files = createMockFiles()

        const mockXHRObject = mockXHRHttpRequest({ status: 500 })

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(errorFn).toBeCalled()
            done()
        })
    })

    test('调用 uploadImg 上传图片成功后数据返回格式不正常，支持配置 onFail 钩子监听', done => {
        expect.assertions(1)

        const fn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                fail: fn,
            },
            customAlert: alertFn,
        })
        const files = createMockFiles()

        const mockXHRObject = mockXHRHttpRequest({
            status: 200,
            res: '{test: 123}',
        })

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(fn).toBeCalled()
            done()
        })
    })

    test('调用 uploadImg 上传图片成功后，支持自定义插入图片函数', done => {
        expect.assertions(1)

        const insertFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                customInsert: insertFn,
            },
        })

        const files = createMockFiles()

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(insertFn).toBeCalled()
            done()
        })
    })

    test('调用 uploadImg， 如果配置 before 钩子阻止上传，会有错误提示', done => {
        expect.assertions(2)

        const beforeFn = jest.fn(() => ({ prevent: true, msg: '阻止发送请求' }))
        const alertFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                before: beforeFn,
            },
            customAlert: alertFn,
        })

        const files = createMockFiles()

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(beforeFn).toBeCalled()
            expect(alertFn).toBeCalledWith('阻止发送请求', 'error')
            done()
        })
    })

    test('调用 uploadImg 上传返回的错误码不符合条件, 会触发fail回调', done => {
        expect.assertions(1)

        const failFn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                fail: failFn,
            },
            customAlert: alertFn,
        })

        const files = createMockFiles()

        const mockXHRObject = mockXHRHttpRequest({
            status: 200,
            res: { test: 123, errno: -1 },
        })

        upload.uploadImg(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(failFn).toBeCalled()
            done()
        })
    })

    test('调用 uploadImg 上传，如果配置 uploadImgShowBase64 参数，则直接插入图片 base64 字符串到编辑器', () => {
        const upload = createUploadImgInstance({
            uploadImgShowBase64: true,
        })

        const files = createMockFiles()

        const mockReadAsDataURL = jest.fn()

        // @ts-ignore
        jest.spyOn(global, 'FileReader').mockImplementation(() => {
            return {
                readAsDataURL: mockReadAsDataURL,
            }
        })

        upload.uploadImg(files)

        expect(mockReadAsDataURL).toBeCalled()
    })

    test('调用 uploadImg 上传超时会触发超时回调', done => {
        expect.assertions(1)

        const timeoutFn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadImgInstance({
            uploadImgServer,
            uploadImgHooks: {
                timeout: timeoutFn,
            },
            customAlert: alertFn,
        })

        const files = createMockFiles()
        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadImg(files)

        mockXHRObject.ontimeout()

        setTimeout(() => {
            expect(timeoutFn).toBeCalled()
            done()
        })
    })
})
