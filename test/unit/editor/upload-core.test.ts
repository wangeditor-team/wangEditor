/**
 * @description 上传post方法
 * @author luochao
 */

import post from '../../../src/editor/upload/upload-core'
import mockXHR from '../../helpers/mock-xhr'

const API_URL = 'http://localhost:8881/api/upload-img'

const origilaXHR = window.XMLHttpRequest
const deaultResponse = { status: 200, res: JSON.stringify({ data: ['url1'], errno: 0 }) }

const mockXMLHttpRequest = (resonse: any = deaultResponse) => {
    const mockObject = jest.fn().mockImplementation(() => mockXHR(resonse))

    // @ts-ignore
    window.XMLHttpRequest = mockObject
}

const createFormData = () => {
    const data = new FormData()
    data.append('name', 'name')
    data.append('filename', 'filename')
    return data
}

describe('Editor upload core post', () => {
    afterAll(() => {
        window.XMLHttpRequest = origilaXHR
    })

    test('能够发送简单的post请求，处理返回的json字符串', done => {
        mockXMLHttpRequest()

        expect.assertions(2)

        const data = createFormData()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: (xhr: XMLHttpRequest, res: any) => {
                expect(res.data).toEqual(['url1'])
                expect(res.errno).toBe(0)
                done()
            },
        })
        // @ts-ignore
        xhr.onreadystatechange()
    })

    test('能够发送简单的post请求，处理返回的json对象', done => {
        mockXMLHttpRequest()

        expect.assertions(2)

        const data = createFormData()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: (xhr: XMLHttpRequest, res: any) => {
                expect(res.data).toEqual(['url1'])
                expect(res.errno).toBe(0)
                done()
            },
        })
        // @ts-ignore
        xhr.onreadystatechange()
    })

    test('发送请求失败后会有错误回调', done => {
        mockXMLHttpRequest({ status: 500, res: JSON.stringify({ data: 'error', errno: 1 }) })

        expect.assertions(2)

        const data = createFormData()

        const successFn = jest.fn()
        const errorFn = jest.fn()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: successFn,
            onError: errorFn,
        })

        // @ts-ignore
        xhr.onreadystatechange()

        setTimeout(() => {
            expect(successFn).not.toBeCalled()
            expect(errorFn).toBeCalled()
            done()
        }, 1000)
    })

    test('发送请求能够监听进度变化', done => {
        mockXMLHttpRequest()

        expect.assertions(2)

        const data = createFormData()

        const successFn = jest.fn()
        const progressFn = jest.fn()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: successFn,
            onProgress: progressFn,
        })

        // @ts-ignore
        xhr.upload.onprogress({ loaded: 50, total: 100 })

        expect(progressFn).toBeCalled()

        // @ts-ignore
        xhr.onreadystatechange()

        setTimeout(() => {
            expect(successFn).toBeCalled()
            done()
        }, 1000)
    })

    test('发送请求能够自定义请求头', done => {
        mockXMLHttpRequest()

        expect.assertions(1)

        const data = createFormData()

        const successFn = jest.fn()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: successFn,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // @ts-ignore
        xhr.onreadystatechange()

        setTimeout(() => {
            expect(successFn).toBeCalled()
            done()
        }, 1000)
    })

    test('发送请求可以配置超时时间，并配置超时回调', done => {
        mockXMLHttpRequest()

        expect.assertions(2)

        const data = createFormData()

        const successFn = jest.fn()
        const timeoutFn = jest.fn()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: successFn,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 1000,
            onTimeout: timeoutFn,
        })

        setTimeout(() => {
            // @ts-ignore
            xhr.ontimeout()

            expect(timeoutFn).toBeCalled()
            expect(successFn).not.toBeCalled()

            done()
        }, 1000)
    })

    test('发送请求前可以添加beforeSend检验', () => {
        mockXMLHttpRequest()

        const data = createFormData()

        const successFn = jest.fn()

        const msg = post(API_URL, {
            formData: data,
            onSuccess: successFn,
            beforeSend: () => ({ prevent: true, msg: '阻止发送请求' }),
        })

        expect(msg).toBe('阻止发送请求')
    })

    test('发送请求成功返回的结果如果不是json字符串，会通过fail回调处理', done => {
        mockXMLHttpRequest({ status: 200, res: '{test: 123}' })

        expect.assertions(2)

        const data = createFormData()

        const successFn = jest.fn()
        const failFn = jest.fn()

        const xhr = post(API_URL, {
            formData: data,
            onSuccess: successFn,
            onFail: failFn,
        })

        // @ts-ignore
        xhr.onreadystatechange()

        setTimeout(() => {
            expect(successFn).not.toBeCalled()
            expect(failFn).toBeCalled()
            done()
        }, 1000)
    })
})
