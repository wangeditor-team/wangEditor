/**
 * @description video 菜单 test
 * @author 童汉
 */

import $ from 'jquery'
import Editor from '../../../src/editor'
import createEditor from '../../helpers/create-editor'
import mockCmdFn from '../../helpers/command-mock'
import Video from '../../../src/menus/video/index'
import { getMenuInstance } from '../../helpers/menus'
import Panel from '../../../src/menus/menu-constructors/Panel'

let editor: Editor
let videoMenu: Video

test('video 菜单：点击弹出 panel', () => {
    editor = createEditor(document, 'div1')
    videoMenu = getMenuInstance(editor, Video) as Video
    videoMenu.clickHandler()
    expect(videoMenu.panel).not.toBeNull()
})

test('video 菜单：插入', () => {
    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    // 插入链接
    mockCmdFn(document)
    const video =
        '<iframe height="498" width="510" src="http://player.youku.com/embed/XMjcwMzc3MzM3Mg==" frameborder="0"></iframe>'
    $videoIFrame.val(video)
    $btnInsert.click()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(video)).toBeGreaterThan(0)
})

test('video 插入前检查和插入后回调', () => {
    videoMenu.clickHandler()
    const fn1 = jest.fn(() => {
        return true
    })
    const fn2 = jest.fn()
    editor.config.onlineVideoCheck = fn1
    editor.config.onlineVideoCallback = fn2

    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    const video =
        '<iframe height="498" width="510" src="http://player.youku.com/embed/XMjcwMzc3MzM3Mg==" frameborder="0"></iframe>'
    $videoIFrame.val(video)
    $btnInsert.click()
    expect(fn1).toBeCalled()
    expect(fn2).toBeCalled()
})

test('video onlineVideoCheck 自定义检查', () => {
    videoMenu.clickHandler()
    editor.config.onlineVideoCheck = function (video: string) {
        if (video === '测试') {
            return '测试禁止插入'
        }
        return true
    }
    const fn3 = jest.fn()
    editor.config.customAlert = fn3

    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    // 插入链接
    mockCmdFn(document)
    const video = '测试'
    $videoIFrame.val(video)
    $btnInsert.click()

    expect(fn3).toBeCalled()
    expect(editor.$textElem.html().indexOf(video)).toBe(-1)
})
