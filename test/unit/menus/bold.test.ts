/**
 * @description bold test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import Bold from '../../../src/menus/bold/index'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let boldMenu: Bold

test('加粗', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 bold 菜单
    boldMenu = getMenuInstance(editor, Bold) as Bold

    // 执行点击事件，模拟加粗
    mockCmdFn(document)
    ;(boldMenu as Bold).clickHandler()
    expect(document.execCommand).toBeCalledWith('bold', false, undefined) // mock fn 被调用
})
