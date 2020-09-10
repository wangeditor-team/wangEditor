/**
 * @description tooltip 事件
 * @author lkw
 */

import $, { DomElement } from '../../../utils/dom-core'
import Tooltip, { TooltipConfType } from '../../menu-constructors/Tooltip'
import Editor from '../../../editor/index'
// import Code from '../index'
// import isActive from '../is-active'
// import Menu from '../../menu-constructors/Menu'

let tooltip: Tooltip | null
let _editor: Editor

/**
 * 显示 tooltip
 * @param $code 链接元素
 */
function showCodeTooltip($code: DomElement) {
    const i18nPrefix = 'menus.panelMenus.code.'
    const t = (text: string, prefix: string = i18nPrefix): string => {
        return _editor.i18next.t(prefix + text)
    }

    const conf = [
        {
            $elem: $(`<span>${t('删除代码')}</span>`),
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

/**
 * preEnterListener是为了统一浏览器 在pre标签内的enter行为而进行的监听
 * 目前并没有使用, 但是在未来处理与Firefox和ie的兼容性时需要用到 暂且放置
 * pre标签内的回车监听
 * @param e
 * @param editor
 */
function preEnterListener(e: KeyboardEvent, editor: Editor) {
    // 获取当前标签元素
    const $selectionElem = editor.selection.getSelectionContainerElem() as DomElement

    // 获取当前节点最顶级标签元素
    const $topElem = $selectionElem?.getNodeTop(editor)

    // 获取顶级节点节点名
    const topNodeName = $topElem?.getNodeName()

    // 非pre标签退出
    if (topNodeName !== 'PRE') return

    // 取消默认行为
    e.preventDefault()

    // 执行换行
    editor.cmd.do('insertHTML', '\n\r')
}

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
    editor.txt.eventHooks.menuClickEvents.push(hideCodeTooltip)
    editor.txt.eventHooks.textScrollEvents.push(hideCodeTooltip)
}

export default bindTooltipEvent
