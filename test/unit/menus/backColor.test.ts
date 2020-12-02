/**
 * @description BackColor menu
 * @author lkw
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import BackColor from '../../../src/menus/back-color'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let backColorMenu: BackColor

test('BackColor 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    backColorMenu = getMenuInstance(editor, BackColor) as BackColor // 赋值给全局变量
    expect(backColorMenu.dropList).not.toBeNull()
    backColorMenu.dropList.show()
    expect(backColorMenu.dropList.isShow).toBe(true)
    backColorMenu.dropList.hide()
    expect(backColorMenu.dropList.isShow).toBe(false)
})

test('BackColor 菜单：背景颜色', () => {
    mockCmdFn(document)
    const cmdVal = '1'
    backColorMenu.command(cmdVal)
    expect(document.execCommand).toBeCalledWith('backColor', false, cmdVal)
})
