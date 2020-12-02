/**
 * @description 事件配置 test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import $ from 'jquery'

test('onblur 事件', () => {
    const editor = createEditor(document, 'div1')
    editor.config.onblur = jest.fn()
    $(editor.$textElem.elems[0]).click() // 点击编辑区域

    const $btn = $('<button>123<button>')
    $('body').append($btn)
    $btn.click() // 点击 btn

    expect(editor.config.onblur).toBeCalled() // 确保 onblur 事件能被触发
})
