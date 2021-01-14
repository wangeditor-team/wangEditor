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
            return false
        }
        return true
    }

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

    expect(editor.$textElem.html().indexOf(video)).toBe(-1)
})

test('video 插入类型: video检查', () => {
    videoMenu.clickHandler()
    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    // 插入链接
    mockCmdFn(document)
    const video = '<video width="250"><source src="myVideo.mp4" type="video/mp4"></video>'
    $videoIFrame.val(video)
    $btnInsert.click()
    videoMenu.clickHandler()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(video)).toBeGreaterThan(0)
})

test('video 插入类型: embed标签', () => {
    videoMenu.clickHandler()
    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    // 插入链接
    mockCmdFn(document)
    const video =
        '<embed src="https://www.youtube.com/embed/N4koEPJ0bjU" allowfullscreen="true" width="425" height="344">'
    $videoIFrame.val(video)
    $btnInsert.click()
    videoMenu.clickHandler()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(video)).toBeGreaterThan(0)
})

test('video 插入类型: object标签', () => {
    videoMenu.clickHandler()
    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    // 插入链接
    mockCmdFn(document)
    const video =
        '<object width="425" height="344" data="https://www.youtube.com/embed/N4koEPJ0bjU"></object>'
    $videoIFrame.val(video)
    $btnInsert.click()
    videoMenu.clickHandler()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(video)).toBeGreaterThan(0)
})

test('video 插入类型: 非iframe、object、video、embed标签禁止插入', () => {
    videoMenu.clickHandler()
    const panel = videoMenu.panel as Panel
    const panelElem = panel.$container.elems[0]
    const $panelElem = $(panelElem) // jquery 对象

    // panel 里的 input 和 button 元素
    const $btnInsert = $panelElem.find(":button[id^='btn-ok']") // id 以 'btn-ok' 的 button
    const $videoIFrame = $panelElem.find(":input[id^='input-iframe']")

    // 插入链接
    mockCmdFn(document)
    const video =
        '<audio controls><source src="/assets_tutorials/media/Loreena_Mckennitt_Snow_56bit.mp3" type="audio/mpeg"></audio>'
    $videoIFrame.val(video)
    $btnInsert.click()
    videoMenu.clickHandler()

    // 此处触发 editor.cmd.do('insertHTML', xx)，可以被 jest 成功执行，具体参考 mockCmdFn 的描述
    expect(editor.$textElem.html().indexOf(video)).toEqual(-1)
})
