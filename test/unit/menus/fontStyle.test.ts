/**
 * @description FontStyle menu
 * @author dyl
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import FontStyle from '../../../src/menus/font-style'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let fontStyleMenu: FontStyle

test('FontStyle 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    fontStyleMenu = getMenuInstance(editor, FontStyle) as FontStyle // 赋值给全局变量
    expect(fontStyleMenu.dropList).not.toBeNull()
    fontStyleMenu.dropList.show()
    expect(fontStyleMenu.dropList.isShow).toBe(true)
    fontStyleMenu.dropList.hide()
    expect(fontStyleMenu.dropList.isShow).toBe(false)
})

test('FontStyle 菜单：设置字体', () => {
    mockCmdFn(document)
    const cmdVal = '宋体'
    fontStyleMenu.command(cmdVal)
    expect(document.execCommand).toBeCalledWith('fontName', false, cmdVal)
})
