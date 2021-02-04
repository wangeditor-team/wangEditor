/**
 * @description text utils paste-text-html test
 * @author luochao
 */
import pasteTextHtml from '../../../src/text/event-hooks/paste-text-html'
import createEditor from '../../helpers/create-editor'
import * as pasteEvents from '../../../src/text/paste/paste-event'
import $ from '../../../src/utils/dom-core'
import mockCommand from '../../helpers/command-mock'

describe('text utils getPasteImgs test', () => {
    test('执行函数会绑定一个 pasteEvents handler', () => {
        const editor = createEditor(document, 'div1')
        const pasteEvents: Function[] = []
        pasteTextHtml(editor, pasteEvents)

        expect(pasteEvents.length).toBeGreaterThanOrEqual(1)
    })

    test('如果当前选区所在元素不存在，执行 pasteEvents 的函数直接返回', () => {
        const editor = createEditor(document, 'div2')
        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => '123')
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '<p>123</p>')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => undefined
        )

        pasteEventList.forEach(fn => {
            const res = fn(new Event(''))
            expect(res).toBeUndefined()
        })
    })

    test('如果当前选区所在元素为CODE， 则执行用户配置的 pasteTextHandle 函数', () => {
        mockCommand(document)

        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)

        const mockPasteTextHandle = jest.fn(() => 'mock123<br>')
        const editor = createEditor(document, 'div3', '', {
            pasteTextHandle: mockPasteTextHandle,
        })

        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => '1234255\n')
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '<p>1234</p>')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
            $('<code></code>')
        )

        pasteEventList.forEach(fn => {
            fn(new Event(''))
        })

        expect(mockPasteTextHandle).toBeCalledWith('1234255<br>')
        expect(document.execCommand).toBeCalledWith('insertHTML', false, 'mock123\n')
    })

    test('如果复制的文本内容是 url，则插入链接', () => {
        mockCommand(document)

        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)

        const editor = createEditor(document, 'div4')

        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        const pasteText = 'http://www.wangeditor.com'

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => pasteText)
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '<p>1234</p>')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
            $('<p></p>')
        )

        pasteEventList.forEach(fn => {
            fn(new Event(''))
        })

        expect(document.execCommand).toBeCalledWith(
            'insertHTML',
            false,
            `<a href="${pasteText}" target="_blank">${pasteText}</a>`
        )
    })

    test('如果复制的内容没有 html 内容，直接返回', () => {
        mockCommand(document)

        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)

        const editor = createEditor(document, 'div4')

        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => '123')
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
            $('<p></p>')
        )

        pasteEventList.forEach(fn => {
            const res = fn(new Event(''))
            expect(res).toBeUndefined()
        })
    })

    test('如果复制的内容没有 html 内容，直接返回', () => {
        mockCommand(document)

        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)

        const editor = createEditor(document, 'div4')

        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => '123')
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
            $('<p></p>')
        )

        pasteEventList.forEach(fn => {
            const res = fn(new Event(''))
            expect(res).toBeUndefined()
        })
    })

    test('如果复制内容有 html， 则执行用户配置的 pasteTextHandle 函数，并且会将非 p 标签的元素替换为 p 标签', () => {
        mockCommand(document)

        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)

        const mockPasteTextHandle = jest.fn(() => '<div>123</div><p></p>')
        const editor = createEditor(document, 'div3', '', {
            pasteTextHandle: mockPasteTextHandle,
        })

        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => '1234255\n')
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '<div>1234</div>')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
            $('<p></p>')
        )

        pasteEventList.forEach(fn => {
            fn(new Event(''))
        })

        expect(mockPasteTextHandle).toBeCalledWith('<div>1234</div>')
    })

    test('如果复制内容有 html， 第一次插入 html 报错会使用 pasteText 再执行一次', () => {
        mockCommand(document)

        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)
        jest.spyOn(document, 'execCommand')
            .mockImplementationOnce(() => {
                throw new Error('error')
            })
            .mockImplementationOnce(jest.fn())

        const mockPasteTextHandle = jest.fn(() => '<div>123</div><p></p>')

        const editor = createEditor(document, 'div3', '', {
            pasteTextHandle: mockPasteTextHandle,
        })

        const pasteEventList: Function[] = []

        pasteTextHtml(editor, pasteEventList)

        jest.spyOn(pasteEvents, 'getPasteText').mockImplementation(() => '<div>12345</div>')
        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '<div>1234</div>')
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
            $('<p></p>')
        )

        pasteEventList.forEach(fn => {
            fn(new Event(''))
        })

        expect(mockPasteTextHandle).toBeCalledWith('<div>1234</div>')
    })

    test('如果复制的内容是段落，则不通过 cmd 插入，自定义插入内容到编辑器', () => {
        mockCommand(document)

        jest.spyOn(pasteEvents, 'getPasteHtml').mockImplementation(() => '<p>1234</p>')

        const editor = createEditor(document, 'div4')
        const pasteEventList: Function[] = []
        pasteTextHtml(editor, pasteEventList)

        pasteEventList.forEach(fn => {
            fn(new Event(''))
        })

        expect(document.execCommand).not.toHaveBeenCalled()
        expect(editor.$textElem.elems[0].innerHTML.indexOf('<p>1234</p>')).toBeGreaterThanOrEqual(0)
    })
})
