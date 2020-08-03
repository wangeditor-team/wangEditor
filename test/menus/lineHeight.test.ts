/**
 * @description lineHeight menu
 * @author lichunlin
 */

import Editor from '../../src/editor'
import createEditor from '../fns/create-editor'
import mockCmdFn from '../fns/command-mock'
import lineHeight from '../../src/menus/lineHeight/index'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let lineHeightMenu: lineHeight

test('lineHeight 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    lineHeightMenu = getMenuInstance(editor, lineHeight) as lineHeight // 赋值给全局变量
    expect(lineHeightMenu.dropList).not.toBeNull()
    lineHeightMenu.dropList.show()
    expect(lineHeightMenu.dropList.isShow).toBe(true)
    lineHeightMenu.dropList.hide()
    expect(lineHeightMenu.dropList.isShow).toBe(false)
})

test('lineHeight 菜单：增加行高', () => {
    mockCmdFn(document)
    const cmdVal = '2'
    lineHeightMenu.command(cmdVal)
    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf('<p style="line-height:2;"><br></p>')).toBeGreaterThan(0)
})
