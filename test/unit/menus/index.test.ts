/**
 * @description menus test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'

let editor: Editor

test('初始化 menus', () => {
    editor = createEditor(document, 'div1') // 赋值全局变量
    expect(editor.menus).not.toBeNull()
})

test('修改菜单激活状态', () => {
    const menus = editor.menus
    menus.changeActive()
    expect(menus.menuList[0].isActive).toBeFalsy()
})
