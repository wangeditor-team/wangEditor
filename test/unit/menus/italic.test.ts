/**
 * @description Italic test
 * @author liuwei
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import Italic from '../../../src/menus/italic/index'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let italicMenu: Italic

test('斜体', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 Italiic 菜单
    italicMenu = getMenuInstance(editor, Italic) as Italic

    // 执行点击事件，模拟斜体
    mockCmdFn(document)
    ;(italicMenu as Italic).clickHandler()
    expect(document.execCommand).toBeCalledWith('italic', false, undefined) // mock fn 被调用
})
