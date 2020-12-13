/**
 * @description editor.text event-hooks tab-to-space test
 * @author luochao
 */
import tabHandler from '../../../src/text/event-hooks/tab-to-space'
import $ from '../../../src/utils/dom-core'
import createEditor from '../../helpers/create-editor'
import mockCommand from '../../helpers/command-mock'

describe('editor.text event-hooks tab-to-space test', () => {
    test('能绑定一个处理 tab 的函数', () => {
        const fn: Function[] = []
        const editor = createEditor(document, 'div1')

        tabHandler(editor, fn)

        expect(fn.length).toBe(1)
    })

    test('能绑定一个处理 tab 的函数，如果不支持 insertHTML 指令，则不执行后续的插入操作', () => {
        mockCommand(document)

        const fn: Function[] = []
        const editor = createEditor(document, 'div1')

        jest.spyOn(editor.cmd, 'queryCommandSupported').mockImplementation(() => false)

        tabHandler(editor, fn)

        fn.forEach(fn => {
            fn()
        })

        expect(document.execCommand).not.toBeCalled()
    })

    test('能绑定一个处理 tab 的函数，如果没有选区内容，则不执行后续的插入操作', () => {
        mockCommand(document)

        const fn: Function[] = []
        const editor = createEditor(document, 'div1')

        jest.spyOn(editor.cmd, 'queryCommandSupported').mockImplementation(() => true)
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => undefined
        )

        tabHandler(editor, fn)

        fn.forEach(fn => {
            fn()
        })

        expect(document.execCommand).not.toBeCalled()
    })

    test('能绑定一个处理 tab 的函数，如果有选区内容，并且是正常的HTML元素，则插入空格', () => {
        mockCommand(document)

        const fn: Function[] = []
        const editor = createEditor(document, 'div1')

        jest.spyOn(editor.cmd, 'queryCommandSupported').mockImplementation(() => true)
        const container = $('<p><br></p>')
        container.append($('<p>123</p>'))
        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => container
        )

        tabHandler(editor, fn)

        fn.forEach(fn => {
            fn()
        })

        expect(document.execCommand).toBeCalledWith('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
    })

    describe('当选区内容父元素为code，pre，hljs或者选区元素为code的情况，则插入特殊的空格', () => {
        mockCommand(document)

        let editor: ReturnType<typeof createEditor>
        let id = 1
        let fn: Function[] = []

        beforeEach(() => {
            editor = createEditor(document, `div${id++}`)

            tabHandler(editor, fn)

            jest.spyOn(editor.cmd, 'queryCommandSupported').mockImplementation(() => true)
        })

        // mock getSelectionContainerElem return value
        const mockGetSelectionContainerElem = (tagString: string, isChild = true) => {
            const container = $(tagString)
            container.append($('<p>123</p>'))
            jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
                isChild ? container.children()! : container
            )
        }

        test('选区元素是 CODE', () => {
            mockGetSelectionContainerElem('<code></code>', false)

            fn.forEach(fn => {
                fn()
            })

            expect(document.execCommand).toBeCalledWith(
                'insertHTML',
                false,
                editor.config.languageTab
            )
        })

        test('选区元素父元素是 CODE', () => {
            mockGetSelectionContainerElem('<code></code>')

            fn.forEach(fn => {
                fn()
            })

            expect(document.execCommand).toBeCalledWith(
                'insertHTML',
                false,
                editor.config.languageTab
            )
        })

        test('选区元素父元素是 PRE', () => {
            mockGetSelectionContainerElem('<pre></pre>')

            fn.forEach(fn => {
                fn()
            })

            expect(document.execCommand).toBeCalledWith(
                'insertHTML',
                false,
                editor.config.languageTab
            )
        })

        test('选区元素父元素是 hljs', () => {
            mockGetSelectionContainerElem('<hljs></hljs>')

            fn.forEach(fn => {
                fn()
            })

            expect(document.execCommand).toBeCalledWith(
                'insertHTML',
                false,
                editor.config.languageTab
            )
        })
    })
})
