/**
 * @description tooltip 事件
 * @author lichunlin
 */

import $, { DomElement } from '../../../utils/dom-core'
import Tooltip, { TooltipConfType } from '../../menu-constructors/Tooltip'
import Editor from '../../../editor/index'

let tooltip: Tooltip | null
let _editor: Editor

/**
 * 显示 tooltip
 * @param  链接元素
 */
function showImgTooltip($node: DomElement) {
    const conf: TooltipConfType = [
        {
            $elem: $("<span class='w-e-icon-trash-o'></span>"),
            onClick: (editor: Editor, $node: DomElement) => {
                // 选中img元素
                editor.selection.createRangeByElem($node)
                editor.selection.restoreSelection()
                editor.cmd.do('delete')
                // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                return true
            },
        },
    ]

    tooltip = new Tooltip(_editor, $node, conf)
    tooltip.create()
}

/**
 * 隐藏 tooltip
 */
function hideImgTooltip() {
    // 移除 tooltip
    if (tooltip) {
        tooltip.remove()
        tooltip = null
    }
}

/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor: Editor) {
    _editor = editor

    // 点击图片元素是，显示 tooltip
    editor.txt.eventHooks.imgClickEvents.push(showImgTooltip)

    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideImgTooltip)
    editor.txt.eventHooks.keyupEvents.push(hideImgTooltip)
    editor.txt.eventHooks.toolbarClickEvents.push(hideImgTooltip)
    editor.txt.eventHooks.menuClickEvents.push(hideImgTooltip)
    editor.txt.eventHooks.textScrollEvents.push(hideImgTooltip)
    editor.txt.eventHooks.imgDragBarMouseDownEvents.push(hideImgTooltip)

    // change 时隐藏
    editor.txt.eventHooks.changeEvents.push(hideImgTooltip)
}

export default bindTooltipEvent
