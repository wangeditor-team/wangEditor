/**
 * @description quote test
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'
import Quote from '../../src/menus/quote/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'
import { NodeType } from '../../src/text/getChildrenJSON'

let editor: Editor
let quoteMenu: Quote
let evt: any

test('引用', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 quote 菜单
    quoteMenu = getMenuInstance(editor, Quote) as Quote

    // 执行点击事件，模拟引用
    mockCmdFn(document)
    ;(quoteMenu as Quote).clickHandler()
    expect(document.execCommand).toBeCalledWith('formatBlock', false, '<blockquote>') // mock fn 被调用
})

// test('引用末尾回车跳出引用', () => {
//     editor = createEditor(document, 'div1') // 赋值给全局变量

//     // 找到 quote 菜单
//     quoteMenu = getMenuInstance(editor, Quote) as Quote

//     // 执行点击事件，模拟引用
//     mockCmdFn(document)
//     ;(quoteMenu as Quote).clickHandler()

//     // const keEvent = document.createEvent('Events')
//     // keEvent.initKeyboardEvent('keydown', true, false, null, false, false, false, false, 13, 0)
//     // keEvent.dispatchEvent(evt)

//     var event = document.createEvent('Events');

//     // 定义事件名为'build'.
//     event.initEvent('keydown', true, true);

//     // evt.document.createEvent('KeyboardEvent')
//     // evt.initKeyEvent('keydown', true, false, null, false, false, false, false, 13, 0)
//     // $(editor.$textElem.elems[0])?.dispatchEvent(evt)

//     const result = editor.txt.getJSON()
//     expect(Array.isArray(result)).toBe(true) // 是一个数组

//     const $node = result[result.length - 1] as NodeType

//     expect($node.tag).not.toBe('blockquote')

//     // expect(document.execCommand).toBeCalledWith('formatBlock', false, '<blockquote>') // mock fn 被调用
// })
