/**
 * @description 编辑区域，入口文件测试
 * @author luochao
 */
import createEditor from '../../helpers/create-editor'
import $ from '../../../src/utils/dom-core'
import dispatchEvent from '../../helpers/mock-dispatch-event'
import { UA } from '../../../src/utils/util'
import { EMPTY_P } from '../../../src/utils/const'

let editor: ReturnType<typeof createEditor>
let id = 1

const nodeList = [
    {
        tag: 'div',
        attrs: [],
        children: [
            {
                tag: 'span',
                attrs: [
                    {
                        name: 'id',
                        value: 'child',
                    },
                ],
                children: [],
            },
        ],
    },
    {
        tag: 'p',
        attrs: [
            {
                name: 'id',
                value: 'node2',
            },
        ],
        children: [],
    },
]

const nodeListHtml = '<div><span id="child"></span></div><p id="node2"></p>'

describe('Editor Text test', () => {
    beforeEach(() => {
        editor = createEditor(document, `div${id++}`)
    })

    test('编辑器初始化，也会初始化 Text', () => {
        expect(editor.txt).not.toBeUndefined()
        expect(editor.txt.eventHooks).not.toBeUndefined()
    })

    test('编辑器初始化，会绑定一系列事件', () => {
        const eventHooks = editor.txt.eventHooks
        Object.keys(eventHooks).forEach(key => {
            // @ts-ignore
            expect(eventHooks[key].length).toBeGreaterThanOrEqual(0)
        })
    })

    test('编辑器初始化后，调用 txt togglePlaceholder 如果 editor txt 没有 html 内容则会展示 placeholder', () => {
        editor.txt.togglePlaceholder()
        expect(editor.$textContainerElem.find('.placeholder').elems[0]).not.toBeUndefined()
        expect(editor.$textContainerElem.find('.placeholder').elems[0]).toHaveStyle('display:block')
    })

    test('编辑器初始化后，调用 txt togglePlaceholder 如果 editor txt 有 html 内容则不展示 placeholder', () => {
        editor.txt.html('<p>123</p>')

        editor.txt.togglePlaceholder()

        expect(editor.$textContainerElem.find('.placeholder').elems[0]).toHaveStyle('display:none')
    })

    test('编辑器初始化后，调用 txt clear 方法，清空编辑内容，只留下 EMPTY_P', () => {
        editor.txt.html('<p>123</p>')

        editor.txt.clear()

        expect(editor.txt.html()).toBe('')
        expect(editor.$textElem.elems[0].innerHTML).toBe(EMPTY_P)
    })

    test('编辑器初始化后，调用 txt setJSON 方法将 JSON 内容设置成 html', () => {
        editor.txt.setJSON(nodeList)

        expect(editor.txt.html()).toBe(nodeListHtml)
    })

    test('编辑器初始化后，调用 txt getJSON 方法将 html 内容还原成JSON', () => {
        editor.txt.html(nodeListHtml)

        const res = editor.txt.getJSON()

        expect(res).toEqual(nodeList)
    })

    test('编辑器初始化后，调用 txt text 方法 能获取 html text', () => {
        editor.txt.html('<p>12345</p>')

        expect(editor.txt.text()).toEqual('12345')
    })

    test('编辑器初始化后，调用 txt text 方法 能设置 text', () => {
        editor.txt.text('12345')

        expect(editor.txt.html()).toEqual('<p>12345</p>')
    })

    test('编辑器初始化后，调用 txt append 方法 能追加 html', () => {
        editor.txt.append('12345<span>1234</span>')

        expect(editor.txt.html()).toEqual('<p>12345<span>1234</span></p>')
    })

    test('编辑器初始化后，编辑器区域会绑定 keyup 事件，触发保存range和激活菜单函数', () => {
        const saveRangeFn = jest.fn()
        const changeActiveFn = jest.fn()
        jest.spyOn(editor.selection, 'saveRange').mockImplementation(saveRangeFn)
        jest.spyOn(editor.menus, 'changeActive').mockImplementation(changeActiveFn)

        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent')
        expect(saveRangeFn).toBeCalled()
        expect(changeActiveFn).toBeCalled()
    })

    test('编辑器初始化后，编辑器区域会绑定 mouseup mousedown 事件，对range进行处理，如果range不存在，不处理', () => {
        const saveRangeFn = jest.fn()
        const getRangeFn = jest.fn(() => null)
        jest.spyOn(editor.selection, 'saveRange').mockImplementation(saveRangeFn)
        jest.spyOn(editor.selection, 'getRange').mockImplementation(getRangeFn)

        dispatchEvent(editor.$textElem, 'mousedown', 'MouseEvent')
        dispatchEvent(editor.$textElem, 'mouseup', 'MouseEvent')

        expect(saveRangeFn).not.toBeCalled()
    })

    test('编辑器初始化后，编辑器区域会绑定 mouseup mousedown 事件，对存在的range进行处理', () => {
        const saveRangeFn = jest.fn()

        const getRangeFn = jest.fn(() => ({
            startOffest: 10,
            endOffset: 14,
            endContainer: $('<p>12345</p>').elems[0],
            setStart: jest.fn(),
        }))

        jest.spyOn(editor.selection, 'saveRange').mockImplementation(saveRangeFn)
        // @ts-ignore
        jest.spyOn(editor.selection, 'getRange').mockImplementation(getRangeFn)

        dispatchEvent(editor.$textElem, 'mousedown', 'MouseEvent')
        dispatchEvent(editor.$textElem, 'mouseup', 'MouseEvent')

        expect(saveRangeFn).toBeCalled()
    })

    test('编辑器初始化后，编辑器区域会绑定 click 事件，触发执行eventsHook clickEvent的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'clickEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'click')

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 enter键 keyup 事件，触发执行eventsHook enterUpEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'enterUpEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent', {
            keyCode: 13,
        })

        // 模拟不是enter键的情况
        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent', {
            keyCode: 0,
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 keyup 事件，触发执行eventsHook keyupEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'keyupEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent')

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 delete键 keyup 事件，触发执行eventsHook deleteUpEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'deleteUpEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent', {
            keyCode: 8,
        })

        // 模拟不是delete键的情况
        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent', {
            keyCode: 0,
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 delete键 keydown 事件，触发执行eventsHook deleteDownEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'deleteDownEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 8,
        })

        // 模拟不是delete键的情况
        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 0,
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 paste 事件，触发执行eventsHook pasteEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'pasteEvents', {
            value: [mockClickFn, mockClickFn],
        })

        // 模拟IE
        jest.spyOn(UA, 'isIE')
            .mockImplementationOnce(() => true)
            .mockImplementationOnce(() => false)

        dispatchEvent(editor.$textElem, 'paste', 'ClipboardEvent')

        expect(mockClickFn.mock.calls.length).toEqual(0)

        dispatchEvent(editor.$textElem, 'paste', 'ClipboardEvent')

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 撤销和取消 快捷键，触发执行历史撤销和重做的函数执行', () => {
        const restoreFn = jest.fn()
        const revokeFn = jest.fn()

        jest.spyOn(editor.history, 'restore').mockImplementation(restoreFn)
        jest.spyOn(editor.history, 'revoke').mockImplementation(revokeFn)

        Object.defineProperty(editor, 'isFocus', {
            value: true,
        })

        // 重做事件
        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 90,
            shiftKey: true,
            ctrlKey: true,
        })

        expect(restoreFn).toBeCalled()

        // 撤回事件
        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 90,
            shiftKey: false,
            ctrlKey: true,
        })

        expect(revokeFn).toBeCalled()
    })

    test('编辑器初始化后，编辑器区域会绑定 tab键 keyup 事件，触发执行eventsHook tabUpEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'tabUpEvents', {
            value: [mockClickFn, mockClickFn],
        })

        // 模拟不是tab键的情况
        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent', {
            keyCode: 0,
        })

        expect(mockClickFn.mock.calls.length).toEqual(0)

        dispatchEvent(editor.$textElem, 'keyup', 'KeyBoardEvent', {
            keyCode: 9,
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域会绑定 tab键 keydown 事件，触发执行eventsHook tabDownEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'tabDownEvents', {
            value: [mockClickFn, mockClickFn],
        })

        // 模拟不是tab键的情况
        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 0,
        })

        expect(mockClickFn.mock.calls.length).toEqual(0)

        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 9,
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    // todo 没法模拟
    test('编辑器初始化后，编辑器区域会绑定 scroll 事件，触发执行eventsHook textScrollEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'textScrollEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'scroll', 'Event')

        expect(mockClickFn.mock.calls.length).toEqual(0)
    })

    // todo 没法模拟
    test('编辑器初始化后，编辑器区域会禁用 dcument dragleave、drop、dragenter、dragover 事件', () => {
        const preventDefaultFn = jest.fn()

        dispatchEvent(editor.$textElem, 'dragleave', 'MouseEvent', {
            preventDefault: preventDefaultFn,
        })

        dispatchEvent(editor.$textElem, 'drop', 'MouseEvent', {
            preventDefault: preventDefaultFn,
        })

        dispatchEvent(editor.$textElem, 'dragenter', 'MouseEvent', {
            preventDefault: preventDefaultFn,
        })

        dispatchEvent(editor.$textElem, 'dragover', 'MouseEvent', {
            preventDefault: preventDefaultFn,
        })

        expect(preventDefaultFn.mock.calls.length).toEqual(0)
    })

    test('编辑器初始化后，编辑器区域 监听 链接点击事件， 触发执行eventsHook linkClickEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'linkClickEvents', {
            value: [mockClickFn, mockClickFn],
        })

        const a = $('<a href="http://www.wangeditor.com">wangeditor</a>')

        editor.$textElem.append(a)

        dispatchEvent(a, 'click', 'Event', {
            target: a.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
        // 模拟事件代理的情况
        const target = $('<li></li>')
        const link = $('<a href="http://www.wangeditor.com">wangeditor</a>').append(target)

        editor.$textElem.append(link)

        dispatchEvent(target, 'click', 'Event', {
            target,
        })

        expect(mockClickFn.mock.calls.length).toEqual(4)
    })

    test('编辑器初始化后，编辑器区域 监听 img点击事件， 触发执行eventsHook imgClickEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'imgClickEvents', {
            value: [mockClickFn, mockClickFn],
        })

        const img = $('<img src="http://www.wangeditor.com/imgs/ali-pay.jpeg" />')

        editor.$textElem.append(img)

        dispatchEvent(img, 'click', 'Event', {
            target: img.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)

        // 模拟表情点击的情况，不执行图片钩子函数
        const emotiomImg = $(
            '<img class="eleImg" data-emoji="emoji" src="http://www.wangeditor.com/imgs/ali-pay.jpeg" />'
        )

        editor.$textElem.append(emotiomImg)

        dispatchEvent(emotiomImg, 'click', 'Event', {
            target: emotiomImg.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域 监听 code区域点击事件， 触发执行eventsHook codeClickEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'codeClickEvents', {
            value: [mockClickFn, mockClickFn],
        })

        const code = $('<pre>123</pre>')

        editor.$textElem.append(code)

        dispatchEvent(code, 'click', 'Event', {
            target: code.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)

        // 模拟点击pre里面的元素
        const codeWrapper = $('<pre>123</pre>')
        const target = $('<span>123</span>')
        codeWrapper.append(target)

        editor.$textElem.append(codeWrapper)

        dispatchEvent(target, 'click', 'Event', {
            target: target.elems[0],
        })

        editor.txt.html('')

        // 模拟不是点击pre区域情况
        dispatchEvent(editor.$textElem, 'click', 'Event', {
            target: editor.$textElem.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(4)
    })

    test('编辑器初始化后，编辑器区域 监听 hr标签点击事件， 触发执行eventsHook splitLineEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'splitLineEvents', {
            value: [mockClickFn, mockClickFn],
        })

        const hr = $('<hr />')

        editor.$textElem.append(hr)

        dispatchEvent(hr, 'click', 'Event', {
            target: hr.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)

        // 模拟点击不是hr情况
        const target = $('<span>123</span>')

        editor.$textElem.append(target)

        dispatchEvent(target, 'click', 'Event', {
            target: target.elems[0],
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑区域容器添加监听点击事件， 点击的元素是图片拖拽调整大小的 bar, 触发执行eventsHook imgDragBarMouseDownEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'imgDragBarMouseDownEvents', {
            value: [mockClickFn, mockClickFn],
        })

        const target = $('<div class="w-e-img-drag-rb"></div>')

        editor.$textContainerElem.append(target)

        dispatchEvent(target, 'mousedown', 'KeyBoardEvent')

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域监听表格区域点击事件， 触发执行eventsHook tableClickEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'tableClickEvents', {
            value: [mockClickFn, mockClickFn],
        })

        const table = $('<table><tr><td>123</td></tr></table>')

        editor.$textElem.append(table)

        dispatchEvent($(table.childNodes()), 'click')

        expect(mockClickFn.mock.calls.length).toEqual(2)

        // 模拟点击非表格区域
        const target = $('<span>123</span>')
        editor.$textElem.append(target)

        dispatchEvent(target, 'click', 'Event')

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })

    test('编辑器初始化后，编辑器区域监听 ednter keydown 事件， 触发执行eventsHook enterDownEvents的函数执行', () => {
        const mockClickFn = jest.fn()

        Object.defineProperty(editor.txt.eventHooks, 'enterDownEvents', {
            value: [mockClickFn, mockClickFn],
        })

        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 13,
        })

        // 模拟非enter键按下
        dispatchEvent(editor.$textElem, 'keydown', 'KeyBoardEvent', {
            keyCode: 0,
        })

        expect(mockClickFn.mock.calls.length).toEqual(2)
    })
})
