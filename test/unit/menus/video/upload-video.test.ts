/**
 * @description upload-video test
 * @author lichunlin
 */
import createEditor from '../../../helpers/create-editor'
import mockCmdFn from '../../../helpers/command-mock'
import mockFile from '../../../helpers/mock-file'
import mockXHR from '../../../helpers/mock-xhr'
import Editor from '../../../../src/editor'
import UploadVideo from '../../../../src/menus/video/upload-video'
import { EMPTY_P } from '../../../../src/utils/const'

let editor: Editor
let id = 1

const videoUrl =
    'https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4'
const uploadVideoServer = 'http://localhost:8881/api/upload-video'

const defaultRes = {
    status: 200,
    res: JSON.stringify({ data: { url: '' }, errno: 0 }),
}

const mockXHRHttpRequest = (res: any = defaultRes) => {
    const mockXHRObject = mockXHR(res)

    const mockObject = jest.fn().mockImplementation(() => mockXHRObject)

    // @ts-ignore
    window.XMLHttpRequest = mockObject

    return mockXHRObject
}

const createUploadVideoInstance = (config: any) => {
    const editor = createEditor(document, `div${id++}`, '', config)
    const uploadVideo = new UploadVideo(editor)
    return uploadVideo
}

const mockSupportCommand = () => {
    mockCmdFn(document)
    document.queryCommandSupported = jest.fn(() => true)
}

const deaultFiles = [{ name: '测试.mp4', size: 512, mimeType: 'video/mp4' }]
const createMockFilse = (fileList: any[] = deaultFiles) => {
    const files = fileList.map(file => mockFile(file))
    return files.filter(Boolean)
}

describe('upload video', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
    })

    test('能够初始化基本的UploadVideo类', () => {
        const uploadVideo = new UploadVideo(editor)

        expect(uploadVideo.insertVideo instanceof Function).toBeTruthy()
        expect(uploadVideo.insertVideo instanceof Function).toBeTruthy()
    })

    test('调用 insertVideo 可以网编辑器里插入视频', () => {
        const uploadVideo = new UploadVideo(editor)

        mockSupportCommand()

        uploadVideo.insertVideo(videoUrl)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<video src="${videoUrl}" controls="controls" style="max-width:100%"></video>${EMPTY_P}`
        )
    })

    test('调用 insertVideo 可以网编辑器里插入视频，可以监听插入视频回调', () => {
        const callback = jest.fn()

        const uploadVideo = createUploadVideoInstance({
            linkVideoCallback: callback,
        })

        mockSupportCommand()

        uploadVideo.insertVideo(videoUrl)

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<video src="${videoUrl}" controls="controls" style="max-width:100%"></video>${EMPTY_P}`
        )
    })

    test('调用 uploadVideo 上传视频', done => {
        expect.assertions(1)

        const jestFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                success: jestFn,
            },
        })

        const files = createMockFilse()
        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(jestFn).toBeCalled()
            done()
        }, 1000)
    })

    test('调用 uploadVideo 上传视频，如果传入的文件为空直接返回', () => {
        const upload = new UploadVideo(editor)

        const res = upload.uploadVideo([])

        expect(res).toBeUndefined()
    })

    test('调用 uploadVideo 上传视频，如果没有配置customUploadVideo, 则必须配置 uploadVideoServer ', () => {
        const upload = new UploadVideo(editor)
        const files = createMockFilse()

        const res = upload.uploadVideo(files)

        expect(res).toBeUndefined()
    })

    test('调用 uploadVideo 上传视频，如果文件没有名字或者size为，则会被过滤掉', () => {
        const fn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            customAlert: fn,
        })

        const files = createMockFilse([{ name: '', size: 0, mimeType: 'video/mp4' }])

        const res = upload.uploadVideo(files)

        expect(res).toBeUndefined()
        expect(fn).toBeCalledWith('传入的文件不合法', 'warning')
    })

    test('调用 uploadVideo 上传视频，如果文件非视频，则返回并提示错误信息', () => {
        const fn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            customAlert: fn,
        })

        const files = createMockFilse([{ name: 'test.txt', size: 200, mimeType: 'text/plain' }])

        const res = upload.uploadVideo(files)

        expect(res).toBeUndefined()
        expect(fn).toBeCalledWith('视频验证未通过: \n【test.txt】不是视频', 'warning')
    })

    test('调用 uploadVideo 上传视频，如果文件体积大小超过配置的大小，则返回并提示错误信息', () => {
        const fn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoMaxSize: 5 * 1024,
            customAlert: fn,
        })

        const files = createMockFilse([
            { name: 'test.mp4', size: 6 * 1024 * 1024, mimeType: 'video/mp4' },
        ])

        const res = upload.uploadVideo(files)

        expect(res).toBeUndefined()
        expect(fn).toBeCalledWith(`视频验证未通过: \n【test.mp4】大于 5M`, 'warning')
    })

    test('调用 uploadVideo 上传视频，如果配置了 customUploadVideo 选项，则调用customUploadVideo上传', () => {
        const fn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            customUploadVideo: fn,
        })

        const files = createMockFilse()

        const res = upload.uploadVideo(files)

        expect(res).toBeUndefined()
        expect(fn).toBeCalled()
    })

    test('调用 uploadVideo 上传视频，如果可以配置uploadVideoParamsWithUrl添加query参数', done => {
        expect.assertions(1)

        const fn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoParams: {
                a: 'a',
                b: 'b',
            },
            uploadVideoParamsWithUrl: true,
            uploadVideoHooks: {
                success: fn,
            },
        })

        const files = createMockFilse()

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(fn).toBeCalled()
            done()
        })
    })

    test('调用 uploadVideo 上传视频，uploadVideoServer支持hash参数拼接', done => {
        expect.assertions(1)

        const fn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoParams: {
                a: 'a',
                b: 'b',
            },
            uploadVideoParamsWithUrl: true,
            uploadVideoHooks: {
                success: fn,
            },
        })

        const files = createMockFilse([
            { name: 'test1.mp4', size: 2048, mimeType: 'video/mp4' },
            { name: 'test2.mp4', size: 2048, mimeType: 'video/mp4' },
        ])

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(fn).toBeCalled()
            done()
        })
    })

    test('调用 uploadVideo 上传视频失败，会有错误提示，并支持配置onError hook', done => {
        expect.assertions(2)

        const fn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                error: fn,
            },
            customAlert: alertFn,
        })
        const files = createMockFilse()

        const mockXHRObject = mockXHRHttpRequest({ status: 500 })

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(fn).toBeCalled()
            expect(alertFn).toBeCalledWith(
                '上传视频错误',
                'error',
                '上传视频错误，服务器返回状态: 500'
            )
            done()
        })
    })

    test('调用 uploadVideo 上传视频后数据返回不正常，会有错误提示，并支持配置onFail hook', done => {
        expect.assertions(2)

        const fn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                fail: fn,
            },
            customAlert: alertFn,
        })
        const files = createMockFilse()

        const mockXHRObject = mockXHRHttpRequest({
            status: 200,
            res: '{test: 123}',
        })

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(fn).toBeCalled()
            expect(alertFn).toBeCalledWith(
                '上传视频失败',
                'error',
                '上传视频返回结果错误，返回结果: {test: 123}'
            )
            done()
        })
    })

    test('调用 uploadVideo 上传视频成功后，支持自定义插入视频函数', done => {
        expect.assertions(1)

        const insertFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                customInsert: insertFn,
            },
        })

        const files = createMockFilse()

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(insertFn).toBeCalled()
            done()
        })
    })

    test('调用 uploadVideo 上传被阻止，会有错误提示', done => {
        expect.assertions(2)

        const beforFn = jest.fn(() => ({ prevent: true, msg: '阻止发送请求' }))
        const alertFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                before: beforFn,
            },
            customAlert: alertFn,
        })

        const files = createMockFilse()

        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(beforFn).toBeCalled()
            expect(alertFn).toBeCalledWith('阻止发送请求', 'error')
            done()
        })
    })

    test('调用 uploadVideo 上传返回的错误码不符合条件会有错误提示，并触发fail回调', done => {
        expect.assertions(2)

        const failFn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                fail: failFn,
            },
            customAlert: alertFn,
        })

        const files = createMockFilse()

        const mockXHRObject = mockXHRHttpRequest({
            status: 200,
            res: { test: 123, errno: -1 },
        })

        upload.uploadVideo(files)

        mockXHRObject.onreadystatechange()

        setTimeout(() => {
            expect(failFn).toBeCalled()
            expect(alertFn).toBeCalledWith(
                '上传视频失败',
                'error',
                '上传视频返回结果错误，返回结果 errno=-1'
            )
            done()
        })
    })

    test('调用 uploadVideo 上传超时会触发超时回调', done => {
        expect.assertions(2)

        const timeoutFn = jest.fn()
        const alertFn = jest.fn()

        const upload = createUploadVideoInstance({
            uploadVideoServer,
            uploadVideoHooks: {
                timeout: timeoutFn,
            },
            customAlert: alertFn,
        })

        const files = createMockFilse()
        const mockXHRObject = mockXHRHttpRequest()

        upload.uploadVideo(files)

        mockXHRObject.ontimeout()

        setTimeout(() => {
            expect(timeoutFn).toBeCalled()
            expect(alertFn).toBeCalledWith('上传视频超时', 'error')
            done()
        })
    })
})
