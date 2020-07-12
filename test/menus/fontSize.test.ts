/**
 * @description FontSize menu
 * @author lkw
 */

import Editor from '../../src/editor'
import createEditor from '../fns/create-editor'
import mockCmdFn from '../fns/command-mock'
import FontSize from '../../src/menus/font-size'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let fontSizeMenu: FontSize

test('FontStyle 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    fontSizeMenu = getMenuInstance(editor, FontSize) as FontSize // 赋值给全局变量
    expect(fontSizeMenu.dropList).not.toBeNull()
    fontSizeMenu.dropList.show()
    expect(fontSizeMenu.dropList.isShow).toBe(true)
    fontSizeMenu.dropList.hide()
    expect(fontSizeMenu.dropList.isShow).toBe(false)
})

test('FontSize 菜单：设置字号', () => {
    mockCmdFn(document)
    const cmdVal = '1'
    fontSizeMenu.command(cmdVal)
    expect(document.execCommand).toBeCalledWith('fontSize', false, cmdVal)
})
