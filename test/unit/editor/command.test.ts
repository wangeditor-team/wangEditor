/**
 * @description command 测试
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import Editor from '../../../src/editor'
import $ from '../../../src/utils/dom-core'

let editor: Editor

test('初始化 command 实例', () => {
    editor = createEditor(document, 'div1') // 赋值全局变量
    expect(editor.cmd).not.toBeNull()
})

test('简单的命令', () => {
    mockCmdFn(document)
    editor.cmd.do('bold')
    expect(document.execCommand).toBeCalled()
})

test('插入 html', () => {
    mockCmdFn(document)
    const text = Date.now().toString()
    editor.cmd.do('insertHTML', `<span>${text}</span>`)
    const html = editor.$textElem.html()
    expect(html.indexOf(text)).toBeGreaterThan(0)
})

test('插入元素', () => {
    mockCmdFn(document)
    const text = Date.now().toString()
    const $span = $(`<span>${text}</span>`)
    editor.cmd.do('insertElem', $span)
    const html = editor.$textElem.html()
    expect(html.indexOf(text)).toBeGreaterThan(0)
})

test('其他 command 方法', () => {
    mockCmdFn(document)
    editor.cmd.queryCommandValue('formatBlock')
    expect(document.queryCommandValue).toBeCalledWith('formatBlock')
    editor.cmd.queryCommandState('bold')
    expect(document.queryCommandState).toBeCalledWith('bold')
    editor.cmd.queryCommandSupported('insertHTML')
    expect(document.queryCommandSupported).toBeCalledWith('insertHTML')
})

// test('1 + 1 = 2', () => expect(1 + 1).toBe(2))
