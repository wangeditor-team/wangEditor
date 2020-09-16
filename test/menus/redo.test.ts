/**
 * @description redo test
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'
import Redo from '../../src/menus/redo/index'
import mockCmdFn from '../fns/command-mock'
import { getMenuInstance } from '../fns/menus'

let editor: Editor
let redoMenu: Redo

test('重做', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 redo 菜单
    redoMenu = getMenuInstance(editor, Redo) as Redo

    // 执行点击事件，模拟引用
    mockCmdFn(document)
    ;(redoMenu as Redo).clickHandler()
    expect(typeof editor.undo.redo()).toBe('string') // 返回值为字符串
    expect(editor.undo.redoStack.length < editor.config.undoLimit).toBe(true) //redo栈长度不超过限制
})
