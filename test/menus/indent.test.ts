/**
 * @description indent menu
 * @author tonghan
 */

import Indent from '../../src/menus/indent/index'
import Editor from '../../src/editor'
import mockCmdFn from '../fns/command-mock'
import createEditor from '../fns/create-editor'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let indentMenu: Indent

test('indent 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    indentMenu = getMenuInstance(editor, Indent) as Indent // 赋值给全局变量
    expect(indentMenu.dropList).not.toBeNull()
    indentMenu.dropList.show()
    expect(indentMenu.dropList.isShow).toBe(true)
    indentMenu.dropList.hide()
    expect(indentMenu.dropList.isShow).toBe(false)
})

// test('indent 菜单：增加缩进', () => {})

// test('indent 菜单：减少缩进', () => {})
