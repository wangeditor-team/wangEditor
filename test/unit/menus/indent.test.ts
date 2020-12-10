/**
 * @description indent menu
 * @author tonghan
 */

import $ from '../../../src/utils/dom-core'
import Indent from '../../../src/menus/indent/index'
import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let indentMenu: Indent

const $h = $('<h1>一个标题</h1>')
const $p = $('<p>一行文字</p>')

test('indent 菜单：dropList', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量
    indentMenu = getMenuInstance(editor, Indent) as Indent // 赋值给全局变量
    expect(indentMenu.dropList).not.toBeNull()
    indentMenu.dropList.show()
    expect(indentMenu.dropList.isShow).toBe(true)
    indentMenu.dropList.hide()
    expect(indentMenu.dropList.isShow).toBe(false)
})

test('indent 菜单：增加缩进', () => {
    editor.$textElem.append($h)
    editor.$textElem.append($p)

    editor.selection.createRangeByElem($h, true, true)
    indentMenu.command('increase')
    expect($h.elems[0].style['paddingLeft']).toBe('')

    editor.selection.createRangeByElem($p, true, true)
    indentMenu.command('increase')
    expect($p.elems[0].style['paddingLeft']).toBe('2em')
})

test('indent 菜单：减少缩进', () => {
    editor.selection.createRangeByElem($p, false, true)
    indentMenu.command('decrease')
    expect($p.elems[0].style['paddingLeft']).toBe('')
})

test('indent 菜单：叠加缩进', () => {
    editor.selection.createRangeByElem($p, true, true)
    indentMenu.command('increase')
    indentMenu.command('increase')
    expect($p.elems[0].style['paddingLeft']).toBe('4em')
})
