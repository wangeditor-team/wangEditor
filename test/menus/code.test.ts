/**
 * @description code 菜单 test
 * @author lkw
 */

import $ from 'jquery'
import Editor from '../../src/editor'
import createEditor from '../fns/create-editor'
import mockCmdFn from '../fns/command-mock'
import Code from '../../src/menus/code/index'
import { getMenuInstance } from '../fns/menus'
import Panel from '../../src/menus/menu-constructors/Panel'

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
    const $inputCode = $panelElem.find(":input[id^='textarea-code']")
    const $inputLanguage = $panelElem.find(":input[id^='select-language']")

    // 插入代码
    mockCmdFn(document)
    const languageType = 'JavaScript'
    const code = '代码'
    $inputLanguage.val(languageType)
    $inputCode.val(code)
    $btnInsert.click()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(
        editor.$textElem.html().indexOf(`<pre><code class="${languageType}">${code}</code></pre>`)
    ).toBeGreaterThan(0)
})
