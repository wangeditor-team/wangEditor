/**
 * @description tooltip 事件
 * @author lkw
 */

import $, { DomElement } from '../../../utils/dom-core'
import Tooltip, { TooltipConfType } from '../../menu-constructors/Tooltip'
import Editor from '../../../editor/index'
import Code from '../index'
import isActive from '../is-active'
import Menu from '../../menu-constructors/Menu'

let tooltip: Tooltip | null
let _editor: Editor

/**
 * 显示 tooltip
 * @param $code 链接元素
 */
function showCodeTooltip($code: DomElement) {
    const conf: TooltipConfType = [
        {
            $elem: $('<span>删除代码</span>'),
            onClick: (editor: Editor, $code: DomElement) => {
                //dom操作删除
                $code.remove()

                // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                return true
            },
        },
    ]

    // 创建 tooltip
    tooltip = new Tooltip(_editor, $code, conf)
    tooltip.create()
}

/**
 * 隐藏 tooltip
 */
function hideCodeTooltip() {
    // 移除 tooltip
    if (tooltip) {
        tooltip.remove()
        tooltip = null
    }
}

function removePreKeyDown() {}

/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor: Editor) {
    _editor = editor

    // 点击代码元素时，显示 tooltip
    editor.txt.eventHooks.codeClickEvents.push(showCodeTooltip)

    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideCodeTooltip)
    editor.txt.eventHooks.toolbarClickEvents.push(hideCodeTooltip)
    editor.txt.eventHooks.textScrollEvents.push(hideCodeTooltip)
}

export default bindTooltipEvent
