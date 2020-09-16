/**
 * @description undo test
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'
import Undo from '../../src/menus/undo/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let undoMenu: Undo

test('撤销', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 undo 菜单
    undoMenu = getMenuInstance(editor, Undo) as Undo

    // 执行点击事件，模拟引用
    mockCmdFn(document)
    ;(undoMenu as Undo).clickHandler()
    expect(typeof editor.undo.undo()).toBe('string') // 返回值为字符串
    expect(editor.undo.undoStack.length < editor.config.undoLimit).toBe(true) //undo栈长度不超过限制
})
