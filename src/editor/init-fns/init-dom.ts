/**
 * @description 初始化编辑器 DOM 结构
 * @author wangfupeng
 */

import Editor from '../index'
import $, { DomElement } from '../../utils/dom-core'
import { getRandom } from '../../utils/util'

export default function (editor: Editor): void {
    const toolbarSelector = editor.toolbarSelector
    const $toolbarSelector = $(toolbarSelector)
    const textSelector = editor.textSelector

    const config = editor.config
    const zIndex = config.zIndex

    let $toolbarElem: DomElement
    let $textContainerElem: DomElement
    let $textElem: DomElement
    let $children: DomElement | null

    if (textSelector == null) {
        // 只有 toolbarSelector ，即是容器的选择器或元素，toolbar 和 text 的元素自行创建
        $toolbarElem = $('<div></div>')
        $textContainerElem = $('<div></div>')

        // 将编辑器区域原有的内容，暂存起来
        $children = $toolbarSelector.children()

        // 添加到 DOM 结构中
        $toolbarSelector.append($toolbarElem).append($textContainerElem)

        // 自行创建的，需要配置默认的样式
        $toolbarElem.css('background-color', '#f1f1f1').css('border', '1px solid #ccc')
        $textContainerElem
            .css('border', '1px solid #ccc')
            .css('border-top', 'none')
            .css('height', '300px')
    } else {
        // toolbarSelector 和 textSelector 都有
        $toolbarElem = $toolbarSelector
        $textContainerElem = $(textSelector)
        // 将编辑器区域原有的内容，暂存起来
        $children = $textContainerElem.children()
    }

    // 编辑区域
    $textElem = $('<div></div>')
    $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%')

    // 初始化编辑区域内容
    if ($children && $children.length) {
        $textElem.append($children)
    } else {
        $textElem.append($('<p><br></p>')) // 新增一行，方便继续编辑
    }

    // 编辑区域加入DOM
    $textContainerElem.append($textElem)

    // 设置通用的 class
    $toolbarElem.addClass('w-e-toolbar')
    $textContainerElem.addClass('w-e-text-container')
    $textContainerElem.css('z-index', `${zIndex}`)
    $textElem.addClass('w-e-text')

    // 添加 ID
    const toolbarElemId = getRandom('toolbar-elem')
    $toolbarElem.attr('id', toolbarElemId)
    const textElemId = getRandom('text-elem')
    $textElem.attr('id', textElemId)

    // 记录属性
    editor.$toolbarElem = $toolbarElem
    editor.$textContainerElem = $textContainerElem
    editor.$textElem = $textElem
    editor.toolbarElemId = toolbarElemId
    editor.textElemId = textElemId
}
