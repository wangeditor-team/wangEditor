/**
 * @description 事件配置 test
 * @author wangfupeng
 */

import createEditor from '../fns/create-editor'
import mockCmdFn from '../fns/command-mock'
import $ from 'jquery'

test('onchange 事件', () => {
    mockCmdFn(document)
    const editor = createEditor(document, 'div1')
    editor.config.onchange = jest.fn()
    editor.cmd.do('insertHTML', '<span>123</span>') // 修改内容，会触发 onchange
    expect(editor.config.onchange).toBeCalled() // 确保 onchange 事件能被触发
})

test('onblur 事件', () => {
    const editor = createEditor(document, 'div1')
    editor.config.onblur = jest.fn()
    $(editor.$textElem.elems[0]).click() // 点击编辑区域

    const $btn = $('<button>123<button>')
    $('body').append($btn)
    $btn.click() // 点击 btn

    expect(editor.config.onblur).toBeCalled() // 确保 onblur 事件能被触发
})

test('onfocus 事件', () => {
    const editor = createEditor(document, 'div1')
    editor.config.onfocus = jest.fn()

    const $btn = $('<button>123<button>')
    $('body').append($btn)
    $btn.click() // 点击 btn

    $(editor.$textElem.elems[0]).click() // 点击编辑区域
    expect(editor.config.onfocus).toBeCalled() // 确保 onfocus 事件能被触发
})
