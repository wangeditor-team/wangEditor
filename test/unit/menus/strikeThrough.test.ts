/**
 * @description strikeThrough test
 * @author lkw
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import StrikeThrough from '../../../src/menus/strike-through/index'
import mockCmdFn from '../../helpers/command-mock'
import { getMenuInstance } from '../../helpers/menus'

let editor: Editor
let strikeThroughMenu: StrikeThrough

test('加删除线', () => {
    editor = createEditor(document, 'div1') // 赋值给全局变量

    // 找到 strikeThrough 菜单
    strikeThroughMenu = getMenuInstance(editor, StrikeThrough) as StrikeThrough

    // 执行点击事件，模拟删除线
    mockCmdFn(document)
    ;(strikeThroughMenu as StrikeThrough).clickHandler()
    expect(document.execCommand).toBeCalledWith('strikeThrough', false, undefined) // mock fn 被调用
})
