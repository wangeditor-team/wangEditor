/**
 * @description head menu
 * @author wangfupeng
 */

import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import Head from '../../../src/menus/head/index'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let headMenu: Head

test('head 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    headMenu = getMenuInstance(editor, Head) as Head // 赋值给全局变量
    expect(headMenu.dropList).not.toBeNull()
    headMenu.dropList.show()
    expect(headMenu.dropList.isShow).toBe(true)
    headMenu.dropList.hide()
    expect(headMenu.dropList.isShow).toBe(false)
})

test('head 菜单：设置标题', () => {
    mockCmdFn(document)
    const cmdVal = '<h1>'
    headMenu.command(cmdVal)
    expect(document.execCommand).toBeCalledWith('formatBlock', false, cmdVal)
})
