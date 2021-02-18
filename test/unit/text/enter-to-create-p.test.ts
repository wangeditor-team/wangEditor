/**
 * @description editor.text event-hooks del-to-keep-p test
 * @author luochao
 */
import enterToCreateP from '../../../src/text/event-hooks/enter-to-create-p'
import $ from '../../../src/utils/dom-core'
import createEditor from '../../helpers/create-editor'
import commandMock from '../../helpers/command-mock'
import { EMPTY_P } from '../../../src/utils/const'

type Editor = ReturnType<typeof createEditor>

let editor: Editor
let id = 1

const mockGetSelectionContainerElem = (editor: Editor, tagString: string, isChild = true) => {
    const container = $(tagString)
    jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(() =>
        isChild ? container.children()! : container
    )
}

describe('editor.text event-hooks tab-to-space test', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('能绑定分别绑定 一个处理 up 和 down 的函数', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        expect(upFns.length).toBe(1)
        expect(downFns.length).toBe(1)
    })

    test('当编辑器选区内容父元素为 <code><br></code> ，则移除内容， 插入 EMPTY_P', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        editor.txt.html(' ')

        mockGetSelectionContainerElem(editor, '<code><br></code>', false)

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual(EMPTY_P)
    })

    test('当编辑器选区内容的父元素不是 $textElm，则不处理', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        editor.txt.html('<p>0</p>')

        const container = $('<p>123</p>')

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => container
        )

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual('<p>0</p>')
    })

    test('当编辑器选区内容是P标签，则不处理', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        editor.txt.html('<p>0</p>')

        const container = $('<p>123</p>')

        editor.$textElem.append(container)

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => container
        )

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual('<p>0</p><p>123</p>')
    })

    test('当编辑器选区内容是非 P 标签并且含有 text 内容，则不处理', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        editor.txt.html('<div>123</div>')

        const container = $('<div>123</div>')

        editor.$textElem.append(container)

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => container
        )

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML).toEqual('<div>123</div><div>123</div>')
    })

    test('当编辑器选区内容为非P标签，且没有文本内容，插入 <p><br></p>', () => {
        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        editor.txt.html('<div></div>')

        const container = $('<div></div>')

        editor.$textElem.append(container)

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => container
        )

        upFns.forEach(fn => {
            fn()
        })

        expect(editor.$textElem.elems[0].innerHTML.indexOf('<p><br></p>')).toBeGreaterThanOrEqual(0)
    })

    test('当编辑器选区内容 $textElm，执行enter down，插入 <p><br></p>', () => {
        commandMock(document)

        const upFns: Function[] = []
        const downFns: Function[] = []

        enterToCreateP(editor, upFns, downFns)

        editor.txt.html('')

        const container = $('<div></div>')

        editor.$textElem.append(container)

        jest.spyOn(editor.selection, 'getSelectionContainerElem').mockImplementation(
            () => editor.$textElem
        )

        const mockPreventDefault = jest.fn()
        const event = new KeyboardEvent('mousedown')
        jest.spyOn(event, 'preventDefault').mockImplementation(mockPreventDefault)
        jest.spyOn(document, 'queryCommandSupported').mockImplementation(() => true)

        downFns.forEach(fn => {
            fn(event)
        })

        expect(mockPreventDefault).toBeCalled()
        expect(document.execCommand).toBeCalledWith('insertHTML', false, '<p><br></p>')
    })
})
