/**
 * @description strikeThrough test
 * @author lkw
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'
import Strikethrough from '../../src/menus/strikethrough/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let strikethroughMenu: Strikethrough

test('加删除线', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 strikeThrough 菜单
    strikethroughMenu = getMenuInstance(editor, Strikethrough) as Strikethrough

    // 执行点击事件，模拟加粗
    mockCmdFn(document)
    ;(strikethroughMenu as Strikethrough).clickHandler()
    expect(document.execCommand).toBeCalledWith('strikeThrough', false, undefined) // mock fn 被调用
})
