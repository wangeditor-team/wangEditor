/**
 * @description justify menu
 * @author liuwei
 */

import Editor from '../../src/editor'
import createEditor from '../fns/create-editor'
import mockCmdFn from '../fns/command-mock'
import justify from '../../src/menus/justify/index'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let justifyMenu: justify

test('justify 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    justifyMenu = getMenuInstance(editor, justify) as justify // 赋值给全局变量
    expect(justifyMenu.dropList).not.toBeNull()
    justifyMenu.dropList.show()
    expect(justifyMenu.dropList.isShow).toBe(true)
    justifyMenu.dropList.hide()
    expect(justifyMenu.dropList.isShow).toBe(false)
})

test('justify 菜单：设置对齐方式', () => {
    mockCmdFn(document)
    const cmdVal = ['justifyCenter', 'justifyRight', 'justifyLeft']
    cmdVal.forEach(val => {
        justifyMenu.command(val)
        expect(document.execCommand).toBeCalledWith(val, false, val)
    })
})
