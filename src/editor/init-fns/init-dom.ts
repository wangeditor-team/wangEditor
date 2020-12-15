/**
 * @description 初始化编辑器 DOM 结构
 * @author wangfupeng
 */

import Editor from '../index'
import $, { DomElement } from '../../utils/dom-core'
import { getRandom } from '../../utils/util'

const styleSettings = {
    border: '1px solid #c9d8db',
    toolbarBgColor: '#FFF',
    toolbarBottomBorder: '1px solid #EEE',
}

export default function (editor: Editor): void {
    const toolbarSelector = editor.toolbarSelector
    const $toolbarSelector = $(toolbarSelector)
    const textSelector = editor.textSelector

    const config = editor.config
    const height = config.height
    const i18next = editor.i18next

    let $toolbarElem: DomElement
    let $textContainerElem: DomElement
    let $textElem: DomElement
    let $children: DomElement | null
    let toolbarElemId: string

    if (textSelector == null) {
        // 只有 toolbarSelector ，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
        $toolbarElem = $('<div></div>')
        $textContainerElem = $('<div></div>')

        // 将编辑器区域原有的内容，暂存起来
        $children = $toolbarSelector.children()

        // 添加到 DOM 结构中
        $toolbarSelector.append($toolbarElem).append($textContainerElem)

        // 自行创建的，需要配置默认的样式
        $toolbarElem
            .css('background-color', styleSettings.toolbarBgColor)
            .css('border', styleSettings.border)
            .css('border-bottom', styleSettings.toolbarBottomBorder)
        $textContainerElem
            .css('border', styleSettings.border)
            .css('border-top', 'none')
            .css('height', `${height}px`)
        // 当只有 toolbarSelector 时，toolbarElemId 自行创建
        toolbarElemId = getRandom('toolbar-elem')
    } else {
        // toolbarSelector 和 textSelector 都有
        $toolbarElem = $toolbarSelector
        $textContainerElem = $(textSelector)
        // 将编辑器区域原有的内容，暂存起来
        $children = $textContainerElem.children()
        // 都有时，toolbarElemId 使用用户自定义的
        toolbarElemId = $toolbarSelector.attr('id')
    }

    // 编辑区域
    $textElem = $('<div></div>')
    $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%')

    // 添加 placeholder
    const $placeholder = $(`<div>${i18next.t(editor.config.placeholder)}</div>`)
    $placeholder.addClass('placeholder')

    // 初始化编辑区域内容
    if ($children && $children.length) {
        $textElem.append($children)
        // 编辑器有默认值的时候隐藏placeholder
        $placeholder.hide()
    } else {
        $textElem.append($('<p><br></p>')) // 新增一行，方便继续编辑
    }

    // 编辑区域加入DOM
    $textContainerElem.append($textElem)

    // 添加placeholder
    $textContainerElem.append($placeholder)

    // 设置通用的 class
    $toolbarElem.addClass('w-e-toolbar').css('z-index', editor.zIndex.get('toolbar'))
    $textContainerElem.addClass('w-e-text-container')
    $textContainerElem.css('z-index', editor.zIndex.get())
    $textElem.addClass('w-e-text')

    // 添加 ID
    $toolbarElem.attr('id', toolbarElemId)
    // 为了保证用户设置的id不被替换，将id设置到data-id上
    const toolbarDataId = getRandom('toolbar-elem')
    $toolbarElem.attr('data-id', toolbarDataId)
    const textElemId = getRandom('text-elem')
    $textElem.attr('id', textElemId)

    // 判断编辑区与容器高度是否一致
    const textContainerCliheight = $textContainerElem.getClientHeight()
    const textElemClientHeight = $textElem.getClientHeight()
    if (textContainerCliheight !== textElemClientHeight) {
        $textElem.css('min-height', textContainerCliheight + 'px')
    }

    // 记录属性
    editor.$toolbarElem = $toolbarElem
    editor.$textContainerElem = $textContainerElem
    editor.$textElem = $textElem
    editor.toolbarElemId = toolbarElemId
    editor.textElemId = textElemId
}
