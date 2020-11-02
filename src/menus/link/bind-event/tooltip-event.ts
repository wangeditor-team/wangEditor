/**
 * @description tooltip 事件
 * @author wangfupeng
 */

import $, { DomElement } from '../../../utils/dom-core'
import Tooltip, { TooltipConfType } from '../../menu-constructors/Tooltip'
import Editor from '../../../editor/index'

/**
 * 生成 Tooltip 的显示隐藏函数
 */
function createShowHideFn(editor: Editor) {
    let tooltip: Tooltip | null

    /**
     * 显示 tooltip
     * @param $link 链接元素
     */
    function showLinkTooltip($link: DomElement) {
        const conf: TooltipConfType = [
            {
                $elem: $(`<span>${editor.i18next.t('menus.panelMenus.link.查看链接')}</span>`),
                onClick: (editor: Editor, $link: DomElement) => {
                    const link = $link.attr('href')
                    window.open(link, '_target')

                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true
                },
            },
            {
                $elem: $(`<span>${editor.i18next.t('menus.panelMenus.link.取消链接')}</span>`),
                onClick: (editor: Editor, $link: DomElement) => {
                    // 选中链接元素
                    editor.selection.createRangeByElem($link)
                    editor.selection.restoreSelection()

                    // 用文字，替换链接
                    const selectionText = $link.text()
                    editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>')

                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true
                },
            },
        ]

        // 创建 tooltip
        tooltip = new Tooltip(editor, $link, conf)
        tooltip.create()
    }

    /**
     * 隐藏 tooltip
     */
    function hideLinkTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove()
            tooltip = null
        }
    }

    return {
        showLinkTooltip,
        hideLinkTooltip,
    }
}

/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor: Editor) {
    const { showLinkTooltip, hideLinkTooltip } = createShowHideFn(editor)

    // 点击链接元素是，显示 tooltip
    editor.txt.eventHooks.linkClickEvents.push(showLinkTooltip)

    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideLinkTooltip)
    editor.txt.eventHooks.keyupEvents.push(hideLinkTooltip)
    editor.txt.eventHooks.toolbarClickEvents.push(hideLinkTooltip)
    editor.txt.eventHooks.menuClickEvents.push(hideLinkTooltip)
    editor.txt.eventHooks.textScrollEvents.push(hideLinkTooltip)
}

export default bindTooltipEvent
