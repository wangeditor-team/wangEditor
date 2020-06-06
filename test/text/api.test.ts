/**
 * @description editor.text API test
 * @author wangfupeng
 */

import createEditor from '../fns/create-editor'
import Editor from '../../src/editor'

let editor: Editor
let TEXT = '这是用于 editor.text API 单元测试的文字'

test('初始化编辑器', () => {
    editor = createEditor(document, 'div1') // 赋值全局变量
    expect(editor.txt).not.toBeNull()
})

test('设置/获取 html', () => {
    const html = `<p>${TEXT}</p>`
    editor.txt.html(html)
    expect(editor.txt.html()).toBe(html)
})

test('设置/获取 html', () => {
    editor.txt.text(TEXT)
    expect(editor.txt.text()).toBe(TEXT)
})

test('追加内容', () => {
    const r = Math.random().toString()
    editor.txt.append(`<p>${r}</p>`)
    const html = editor.txt.html() || ''
    expect(html.indexOf(r)).toBeGreaterThan(0)
})

// 最后测
test('清空内容', () => {
    editor.txt.clear()
    expect(editor.txt.html()).toBe('<p><br></p>')
    expect(editor.txt.text()).toBe('')
})
