/**
 * @description undo test
 */

import createEditor from '../fns/create-editor'
import Undo from '../../src/menus/undo/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'

test('撤销', () => {
    const editor = createEditor(document, 'div1') // 赋值给全局变量

    // 执行点击事件，模拟引用
    mockCmdFn(document)
    editor.cmd.do('insertHTML', '<span>123</span>')

    // 找到 undo 菜单
    const undo = getMenuInstance(editor, Undo) as Undo
    undo.clickHandler()
    expect(editor.history.size).toEqual([0, 1])
})
