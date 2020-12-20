/**
 * @description Img menu paste-img
 * @author luochao
 */
import createEditor from '../../../helpers/create-editor'
import bindPasteImgEvent from '../../../../src/menus/img/bind-event/paste-img'
import UploadImg from '../../../../src/menus/img/upload-img'
import mockFile from '../../../helpers/mock-file'
import mockCmdFn from '../../../helpers/command-mock'
import * as pasteEvents from '../../../../src/text/paste/paste-event'

const mockFiles = [mockFile({ name: 'test.png', size: 200, mimeType: 'image/png' })]
const mockUploadImg = jest.fn()

jest.mock('../../../../src/menus/img/upload-img', () => {
    return jest.fn().mockImplementation(() => {
        return { uploadImg: mockUploadImg }
    })
})

describe('Img menu paste-img', () => {
    beforeEach(() => {
        // @ts-ignore
        UploadImg.mockClear()
        mockUploadImg.mockClear()
    })

    test('调用 bindPasteImgEvent 方法给编辑器绑定paste事件', () => {
        const editor = createEditor(document, 'div1')

        bindPasteImgEvent(editor)

        expect(editor.txt.eventHooks.pasteEvents.length).toBeGreaterThanOrEqual(1)
    })

    test('调用 bindPasteImgEvent 方法给编辑器绑定paste事件后，执行pasteEvent里面的函数会触发上传', () => {
        mockCmdFn(document)

        const mock = jest.spyOn(pasteEvents, 'getPasteImgs')

        mock.mockReturnValue(mockFiles)

        const editor = createEditor(document, 'div1')

        bindPasteImgEvent(editor)

        const mockGetData = jest.fn().mockImplementation(() => '')

        const eventHooks = editor.txt.eventHooks.pasteEvents
        const mockEvent = { clipboardData: { getData: mockGetData, items: mockFiles } }

        eventHooks.forEach(fn => {
            // @ts-ignore
            fn(mockEvent)
        })

        expect(UploadImg).toBeCalled()
        expect(mockUploadImg).toBeCalledWith(mockFiles)
    })

    test('调用 bindPasteImgEvent 方法给编辑器绑定paste事件后，执行pasteEvent里面的函数会如果粘贴板没有图片文件，则不会触发上传逻辑', () => {
        mockCmdFn(document)

        const mock = jest.spyOn(pasteEvents, 'getPasteImgs')

        mock.mockReturnValue([])

        const editor = createEditor(document, 'div1')

        bindPasteImgEvent(editor)

        const mockGetData = jest.fn().mockImplementation(() => '')

        const eventHooks = editor.txt.eventHooks.pasteEvents
        const mockEvent = { clipboardData: { getData: mockGetData, items: mockFiles } }

        eventHooks.forEach(fn => {
            // @ts-ignore
            fn(mockEvent)
        })

        expect(UploadImg).toBeCalled()
    })

    test('调用 bindPasteImgEvent 方法给编辑器绑定paste事件后，执行pasteEvent里面的函数如果粘贴的内容有HTML会直接返回', () => {
        mockCmdFn(document)

        const mock = jest.spyOn(pasteEvents, 'getPasteImgs')

        mock.mockReturnValue(mockFiles)

        const editor = createEditor(document, 'div1')

        bindPasteImgEvent(editor)

        const mockGetData = jest.fn().mockImplementation(() => '<span></span>')

        const eventHooks = editor.txt.eventHooks.pasteEvents
        const mockEvent = { clipboardData: { getData: mockGetData, items: mockFiles } }

        eventHooks.forEach(fn => {
            // @ts-ignore
            fn(mockEvent)
        })

        expect(UploadImg).toBeCalled()
    })

    test('调用 bindPasteImgEvent 方法给编辑器绑定paste事件后，执行pasteEvent里面的函数如果粘贴的内容有Text会直接返回', () => {
        mockCmdFn(document)

        const mock = jest.spyOn(pasteEvents, 'getPasteImgs')

        mock.mockReturnValue(mockFiles)

        const editor = createEditor(document, 'div1')

        bindPasteImgEvent(editor)

        const mockGetData = jest.fn().mockImplementation((type: string) => {
            if (type === 'text' || type === 'text/plain') {
                return '123'
            }
            return ''
        })

        const eventHooks = editor.txt.eventHooks.pasteEvents
        const mockEvent = { clipboardData: { getData: mockGetData, items: mockFiles } }

        eventHooks.forEach(fn => {
            // @ts-ignore
            fn(mockEvent)
        })

        expect(UploadImg).toBeCalled()
    })
})
