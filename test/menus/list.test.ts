/**
 * @description list menu
 * @author tonghan
 */

import $ from '../../src/utils/dom-core'
import List from '../../src/menus/list/index'
import Editor from '../../src/editor'
import createEditor from '../fns/create-editor'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let listMenu: List

const $p = $('<p>一行文字</p>')

test('list 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    listMenu = getMenuInstance(editor, List) as List // 赋值给全局变量
    expect(listMenu.dropList).not.toBeNull()
    listMenu.dropList.show()
    expect(listMenu.dropList.isShow).toBe(true)
    listMenu.dropList.hide()
    expect(listMenu.dropList.isShow).toBe(false)
})

test('list 菜单：设置序列 转换序列', () => {
    editor.$textElem.append($p)
    editor.selection.createRangeByElem($p, false, true)
    listMenu.command('disorder')
    expect($(editor.selection.getSelectionStartElem()).getNodeName()).toBe('UL')
    listMenu.command('order')
    expect($(editor.selection.getSelectionStartElem()).getNodeName()).toBe('OL')
})

test('list 菜单：取消序列', () => {
    listMenu.command('disorder')
    expect($(editor.selection.getSelectionStartElem()).getNodeName()).toBe('UL')
    listMenu.command('disorder')
    expect($(editor.selection.getSelectionStartElem()).getNodeName()).toBe('P')
})
