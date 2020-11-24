/**
 * @description underline test
 * @author dyl
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import Underline from '../../../src/menus/underline/index'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let underlineMenu: Underline

test('下划线', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 underline 菜单
    underlineMenu = getMenuInstance(editor, Underline) as Underline

    // 执行点击事件，模拟下划线功能
    mockCmdFn(document)
    ;(underlineMenu as Underline).clickHandler()
    expect(document.execCommand).toBeCalledWith('underline', false, undefined) // mock fn 被调用
})
