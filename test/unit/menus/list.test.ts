/**
 * @description list menu
 * @author tonghan
 */

import List, { ListType } from '../../../src/menus/list/index'
import Editor from '../../../src/editor'
import mockCmdFn from '../../helpers/command-mock'
import createEditor from '../../helpers/create-editor'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let listMenu: List

test('list 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    listMenu = getMenuInstance(editor, List) as List // 赋值给全局变量
    expect(listMenu.dropList).not.toBeNull()
    listMenu.dropList.show()
    expect(listMenu.dropList.isShow).toBe(true)
    listMenu.dropList.hide()
    expect(listMenu.dropList.isShow).toBe(false)
})

test('list 菜单：有序', () => {
    mockCmdFn(document)
    listMenu.command(ListType.OrderedList)
    expect(editor.$textElem.html().includes('<ol>')).toBeTruthy()
})

test('list 菜单：无序', () => {
    listMenu.command(ListType.UnorderedList)
    expect(editor.$textElem.html().includes('<ul>')).toBeTruthy()
})
