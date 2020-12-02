/**
 * @description 事件配置 test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import $ from 'jquery'

test('onfocus 事件', () => {
    const editor = createEditor(document, 'div1')
    editor.config.onfocus = jest.fn()

    const $btn = $('<button>123<button>')
    $('body').append($btn)
    $btn.click() // 点击 btn

    $(editor.$textElem.elems[0]).click() // 点击编辑区域
    expect(editor.config.onfocus).toBeCalled() // 确保 onfocus 事件能被触发
})
