/**
 * @description tooltip 测试
 * @author wangfupeng
 */

import Tooltip from '../../../src/menus/menu-constructors/Tooltip'
import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import $ from '../../../src/utils/dom-core'

let editor: Editor
let tooltip: Tooltip
const $elem1 = $('<span>文字1</span>')
const fn1 = jest.fn()

test('初始化 tooltip', () => {
    // 初始化编辑器
    editor = createEditor(document, 'div1')
    const $p = $('<p>一行文字</p>')
    editor.$textElem.append($p)

    // 初始化 tooltip
    const conf = [
        {
            $elem: $elem1,
            onClick: fn1,
        },
        {
            $elem: $('<span>文字2</span>'),
            onClick: jest.fn(),
        },
    ]
    tooltip = new Tooltip(editor, $p, conf)

    expect(tooltip).not.toBeNull()
})

test('点击 tooltip', () => {
    tooltip.create()

    $elem1.elems[0].click()
    expect(fn1).toBeCalled()
})

test('tooltip 显示和隐藏', () => {
    tooltip.create()
    expect(tooltip.isShow).toBe(true)

    tooltip.remove()
    expect(tooltip.isShow).toBe(false)
})
