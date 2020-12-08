/**
 * @description FontColor menu
 * @author lkw
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import FontColor from '../../../src/menus/font-color'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let fontColorMenu: FontColor

test('FontColor 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    fontColorMenu = getMenuInstance(editor, FontColor) as FontColor // 赋值给全局变量
    expect(fontColorMenu.dropList).not.toBeNull()
    fontColorMenu.dropList.show()
    expect(fontColorMenu.dropList.isShow).toBe(true)
    fontColorMenu.dropList.hide()
    expect(fontColorMenu.dropList.isShow).toBe(false)
})

test('FontColor 菜单：文字颜色', () => {
    mockCmdFn(document)
    const cmdVal = '1'
    fontColorMenu.command(cmdVal)
    expect(document.execCommand).toBeCalledWith('foreColor', false, cmdVal)
})
