/**
 * @description code 菜单 test
 * @author lkw
 */

import $ from 'jquery'
import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import Code from '../../../src/menus/code/index'
import { getMenuInstance } from '../../helpers/menus'
import Panel from '../../../src/menus/menu-constructors/Panel'
import hljs from 'highlight.js'

let editor: Editor
let codeMenu: Code

test('code 菜单：点击弹出 panel', () => {
    editor = createEditor(document, 'div1')
    codeMenu = getMenuInstance(editor, Code) as Code
    codeMenu.clickHandler()
    expect(codeMenu.panel).not.toBeNull()
})

test('code 菜单：插入代码', () => {
    const panel = codeMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    // const $btnDel = $panelElem.find(":button[id^='btn-del']")
    const $language = $panelElem.find(":input[id^='select']")
    const $inputText = $panelElem.find(":input[id^='input-iframe']")

    // 插入代码
    mockCmdFn(document)
    const type = 'JavaScript'
    const code = 'let a = 0;'
    $inputText.val(code)
    $language.val(type)
    $btnInsert.click()

    // 挂载hljstxt
    editor.highlight = hljs

    let txtHtml = editor.txt.html()

    let html: string = txtHtml ? txtHtml : ''

    // 销毁编辑器
    editor.destroy()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(html.indexOf(`<code class="${type}">${code}</code>`)).toBeGreaterThan(0)
})

test('code 菜单：插入不合法的html代码, 测试xss', () => {
    const editor = createEditor(document, 'div1')
    const codeMenu = getMenuInstance(editor, Code) as Code
    codeMenu.clickHandler()

    const panel = codeMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    // const $btnDel = $panelElem.find(":button[id^='btn-del']")
    const $language = $panelElem.find(":input[id^='select']")
    const $inputText = $panelElem.find(":input[id^='input-iframe']")

    // 插入代码
    mockCmdFn(document)
    const type = 'Html'
    const code = '</xmp></code></pre><img src=1 onerror=alert(/xss/)>'

    $inputText.val(code)
    $language.val(type)
    $btnInsert.click()

    // 挂载hljstxt
    editor.highlight = hljs

    let txtHtml = editor.txt.html()

    let html: string = txtHtml ? txtHtml : ''

    // 过滤后的代码
    const filterCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(html.indexOf(`<code class="${type}">${filterCode}</code>`)).toBeGreaterThan(0)
})
