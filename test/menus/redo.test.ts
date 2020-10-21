/**
 * @description redo test
 */

import createEditor from '../fns/create-editor'
import Redo from '../../src/menus/redo/index'
import Undo from '../../src/menus/undo/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'

test('重做', () => {
    mockCmdFn(document)
    const editor = createEditor(document, 'div1') // 赋值给全局变量

    editor.cmd.do('insertHTML', '<span>123</span>')

    const undo = getMenuInstance(editor, Undo) as Undo
    const redo = getMenuInstance(editor, Redo) as Redo

    // 执行点击事件，模拟引用
    undo.clickHandler()
    redo.clickHandler()

    expect(editor.history.size).toEqual([1, 0])
})
