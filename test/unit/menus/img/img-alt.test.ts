/**
 * @description 图片alt 单元测试
 * @author jerexyz
 */

import $ from 'jquery'
import Editor from '../../../../src/editor'
import createEditor from '../../../helpers/create-editor'
import mockCmdFn from '../../../helpers/command-mock'
import ImgMenu from '../../../../src/menus/img/index'
import { getMenuInstance } from '../../../helpers/menus'
import Panel from '../../../../src/menus/menu-constructors/Panel'

let editor: Editor
let imgMenu: ImgMenu

test('img 菜单：点击弹出 panel', () => {
    editor = createEditor(document, 'div1', '', { showLinkImgAlt: true, showLinkImgHref: true })
    imgMenu = getMenuInstance(editor, ImgMenu) as ImgMenu
    imgMenu.clickHandler()
    expect(imgMenu.panel).not.toBeNull()
})

test('img 菜单：插入网络图片并设置图片alt', () => {
    const panel = imgMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $inputLink = $panelElem.find(":input[id^='input-link-url']")
    const $inputLinkAlt = $panelElem.find(":input[id^='input-link-url-alt']")
    const $btnInsert = $panelElem.find(":button[id^='btn-link']") // id 以 'btn-link' 的 button

    // 插入网络图片
    mockCmdFn(document)
    const link = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
    const alt = 'test_img_alt'
    $inputLink.val(link)
    $inputLinkAlt.val(alt)
    $btnInsert.click()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(`<img src="${link}" alt="${alt}"`)).toBeGreaterThan(0)
})
