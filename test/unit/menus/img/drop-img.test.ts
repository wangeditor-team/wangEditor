/**
 * @description Img menu bind-event drop-img
 * @author luochao
 */
import createEditor from '../../../helpers/create-editor'
import UploadImg from '../../../../src/menus/img/upload-img'
import bindDropImg from '../../../../src/menus/img/bind-event/drop-img'
import mockFile from '../../../helpers/mock-file'

const mockUploadImg = jest.fn()

jest.mock('../../../../src/menus/img/upload-img', () => {
    return jest.fn().mockImplementation(() => {
        return { uploadImg: mockUploadImg }
    })
})

describe('Img menu bind-event drop-img', () => {
    beforeEach(() => {
        // @ts-ignore
        UploadImg.mockClear()
        mockUploadImg.mockClear()
    })

    test('调用 dropImg 方法绑定drop-img事件', () => {
        const editor = createEditor(document, 'div1')

        bindDropImg(editor)

        expect(editor.txt.eventHooks.dropEvents.length).toBeGreaterThanOrEqual(1)
    })

    test('调用 dropImg 方法绑定drop-img事件后，执行dropEvents里面的方法会触发uploadImg调用', () => {
        const editor = createEditor(document, 'div2')

        bindDropImg(editor)

        const dropEvents = editor.txt.eventHooks.dropEvents

        expect(dropEvents.length).toBeGreaterThanOrEqual(1)

        const files = [mockFile({ name: 'test.png', size: 200, mimeType: 'image/png' })]
        const mockDropEvent = { dataTransfer: { files } }
        dropEvents.forEach(fn => {
            // @ts-ignore
            fn(mockDropEvent)
        })

        expect(UploadImg).toHaveBeenCalled()
        expect(mockUploadImg).toBeCalledWith(files)
    })

    test('调用 dropImg 方法绑定drop-img事件后，如果dropEvent触发的事件参数的文件为空，则不触发上传', () => {
        const editor = createEditor(document, 'div3')

        bindDropImg(editor)

        const dropEvents = editor.txt.eventHooks.dropEvents

        expect(dropEvents.length).toBeGreaterThanOrEqual(1)

        const files: any[] = []
        const mockDropEvent = { dataTransfer: { files } }
        dropEvents.forEach(fn => {
            // @ts-ignore
            fn(mockDropEvent)
        })

        expect(UploadImg).toBeCalled()
        expect(mockUploadImg).not.toBeCalled()
    })
})
