/**
 * @description editor.text API test
 * @author wangfupeng
 */

import createEditor from '../../helpers/create-editor'
import Editor from '../../../src/editor'
import { NodeType } from '../../../src/text/getChildrenJSON'

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

test('获取 JSON', () => {
    const html = `<p>我是一行文字</p><p>我是一行<b>这里加粗</b>文字</p><p>我是一行<a href="123" target="_blank">链接</a>文字</p>` // 不要换行

    editor.txt.html(html)

    const result = editor.txt.getJSON()

    expect(Array.isArray(result)).toBe(true) // 是一个数组

    // 第一个 p 标签
    const p0 = result[0] as NodeType
    expect(p0.tag).toBe('p')
    expect(p0.children[0]).toBe('我是一行文字')

    // 第二个 p 标签
    const p1 = result[1] as NodeType
    expect(p1.children.length).toBe(3)
    const b = p1.children[1] as NodeType // b 标签
    expect(b.tag).toBe('b')
    expect(b.children[0]).toBe('这里加粗')

    // 第三个 p 标签
    const p2 = result[2] as NodeType
    const a = p2.children[1] as NodeType // a 标签
    expect(a.attrs.length).toBe(2)
    const attr1 = a.attrs[0] // 属性
    expect(attr1.name).toBe('href')
    expect(attr1.value).toBe('123')
    const attr2 = a.attrs[1]
    expect(attr2.name).toBe('target')
    expect(attr2.value).toBe('_blank')
})

// 最后测
test('清空内容', () => {
    editor.txt.clear()
    expect(editor.txt.html()).toBe('')
    expect(editor.txt.text()).toBe('')
})
