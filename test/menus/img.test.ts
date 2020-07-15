/**
 * @description 图片菜单 单元测试
 * @author wangfupeng
 */

import $ from 'jquery'
import Editor from '../../src/editor'
import createEditor from '../fns/create-editor'
import mockCmdFn from '../fns/command-mock'
import ImgMenu from '../../src/menus/img/index'
import { getMenuInstance } from '../fns/menus'
import Panel from '../../src/menus/menu-constructors/Panel'

let editor: Editor
let imgMenu: ImgMenu

test('img 菜单：点击弹出 panel', () => {
    editor = createEditor(document, 'div1')
    imgMenu = getMenuInstance(editor, ImgMenu) as ImgMenu
    imgMenu.clickHandler()
    expect(imgMenu.panel).not.toBeNull()
})

test('img 菜单：插入网络图片', () => {
    const panel = imgMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $inputLink = $panelElem.find(":input[id^='input-link-url']")
    const $btnInsert = $panelElem.find(":button[id^='btn-link']") // id 以 'btn-link' 的 button

    // 插入网络图片
    mockCmdFn(document)
    const link = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
    $inputLink.val(link)
    $btnInsert.click()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(`<img src="${link}"`)).toBeGreaterThan(0)
})

test('img 菜单：显示上传图片的按钮', () => {
    const editor2 = createEditor(document, 'div2')
    editor2.config.uploadImgServer = '/upload-img'
    imgMenu = getMenuInstance(editor2, ImgMenu) as ImgMenu
    imgMenu.clickHandler()

    const panel = imgMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // file input
    const $inputLink = $panelElem.find(":input[id^='up-file-id']")

    // 有 file input ，即可支持图片上传
    expect($inputLink.length).toBe(1)
})

// PS: 上传接口，暂不测试，后面再补充吧
