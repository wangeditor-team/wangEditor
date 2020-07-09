/**
 * @description quote test
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'
import Quote from '../../src/menus/quote/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let quoteMenu: Quote

test('引用', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 quote 菜单
    quoteMenu = getMenuInstance(editor, Quote) as Quote

    // 执行点击事件，模拟引用
    mockCmdFn(document)
    ;(quoteMenu as Quote).clickHandler()
    expect(document.execCommand).toBeCalledWith('formatBlock', false, '<blockquote>') // mock fn 被调用
})
