/**
 * @description link 菜单 test
 * @author wangfupeng
 */

import $ from 'jquery'
import Editor from '../../../../src/editor'
import createEditor from '../../../helpers/create-editor'
import mockCmdFn from '../../../helpers/command-mock'
import Link from '../../../../src/menus/link/index'
import { getMenuInstance } from '../../../helpers/menus'
import Panel from '../../../../src/menus/menu-constructors/Panel'

let editor: Editor
let linkMenu: Link

describe('link菜单', () => {
    test('link 菜单：点击弹出 panel', () => {
        editor = createEditor(document, 'div1')
        linkMenu = getMenuInstance(editor, Link) as Link
        linkMenu.clickHandler()
        expect(linkMenu.panel).not.toBeNull()
    })

    test('link 菜单：插入链接', () => {
        const panel = linkMenu.panel as Panel
        const panelElem = panel.$container.elems[0]
        const $panelElem = $(panelElem) // jquery 对象

        // panel 里的 input 和 button 元素
        const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
        // const $btnDel = $panelElem.find(":button[id^='btn-del']")
        const $inputLink = $panelElem.find(":input[id^='input-link']")
        const $inputText = $panelElem.find(":input[id^='input-text']")

        // 插入链接
        mockCmdFn(document)
        const text = '文字'
        const link = 'http://www.baidu.com/'
        $inputText.val(text)
        $inputLink.val(link)
        $btnInsert.click()

        // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
        expect(
            editor.$textElem.html().indexOf(`<a target="_blank" href="${link}">${text}</a>`)
        ).toBeGreaterThan(0)
    })
})
