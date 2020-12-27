/**
 * @description tooltip 事件
 * @author lichunlin
 */

import $, { DomElement } from '../../../utils/dom-core'
import Tooltip, { TooltipConfType } from '../../menu-constructors/Tooltip'
import Editor from '../../../editor/index'

/**
 * 生成 Tooltip 的显示隐藏函数
 */
export function createShowHideFn(editor: Editor) {
    let tooltip: Tooltip | null

    /**
     * 显示 tooltip
     * @param $node 链接元素
     */
    function showVideoTooltip($node: DomElement) {
        const conf: TooltipConfType = [
            {
                $elem: $("<span class='w-e-icon-trash-o'></span>"),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 选中video元素
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()
                    editor.cmd.do('delete')
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true
                },
            },
        ]

        tooltip = new Tooltip(editor, $node, conf)
        tooltip.create()
    }

    /**
     * 隐藏 tooltip
     */
    function hideVideoTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove()
            tooltip = null
        }
    }

    return {
        showVideoTooltip,
        hideVideoTooltip,
    }
}

/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
export default function bindTooltipEvent(editor: Editor) {
    const { showVideoTooltip, hideVideoTooltip } = createShowHideFn(editor)

    // 点击图片元素是，显示 tooltip
    editor.txt.eventHooks.videoClickEvents.push(showVideoTooltip)

    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideVideoTooltip)
    editor.txt.eventHooks.keyupEvents.push(hideVideoTooltip)
    editor.txt.eventHooks.toolbarClickEvents.push(hideVideoTooltip)
    editor.txt.eventHooks.menuClickEvents.push(hideVideoTooltip)
    editor.txt.eventHooks.textScrollEvents.push(hideVideoTooltip)

    // change 时隐藏
    editor.txt.eventHooks.changeEvents.push(hideVideoTooltip)
}
