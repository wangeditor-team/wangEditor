/**
 * @description tooltip 事件
 * @author lichunlin
 */

import $, { DomElement } from '../../../utils/dom-core'
import Tooltip, { TooltipConfType } from '../../menu-constructors/Tooltip'
import Editor from '../../../editor/index'

//操作事件
import operatingEvent from './event/operating-event'

import getNode from './event/getNode'
import { EMPTY_P } from '../../../utils/const'

/**
 * 生成 Tooltip 的显示隐藏函数
 */
function createShowHideFn(editor: Editor) {
    let tooltip: Tooltip | null

    /**
     * 显示 tooltip
     * @param  table元素
     */
    function showTableTooltip($node: DomElement) {
        const getnode = new getNode(editor)

        const i18nPrefix = 'menus.panelMenus.table.'
        const t = (text: string, prefix: string = i18nPrefix): string => {
            return editor.i18next.t(prefix + text)
        }

        const conf: TooltipConfType = [
            {
                // $elem: $("<span class='w-e-icon-trash-o'></span>"),
                $elem: $(`<span>${t('删除表格')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 选中img元素
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()
                    editor.cmd.do('insertHTML', EMPTY_P)
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true
                },
            },
            {
                $elem: $(`<span>${t('添加行')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 禁止多选操作
                    let isMore = isMoreRowAction(editor)
                    if (isMore) {
                        return true
                    }
                    //当前元素
                    let selectDom = $(editor.selection.getSelectionStartElem())
                    //当前行
                    let $currentRow = getnode.getRowNode(selectDom.elems[0])
                    if (!$currentRow) {
                        return true
                    }
                    //获取当前行的index
                    const index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow))
                    //生成要替换的html
                    let htmlStr = getnode.getTableHtml($node.elems[0])
                    //生成新的table
                    let newdom: string = getnode.getTableHtml(
                        operatingEvent.ProcessingRow($(htmlStr), index).elems[0]
                    )
                    // 选中table
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()

                    editor.cmd.do('insertHTML', newdom)

                    return true
                },
            },
            {
                $elem: $(`<span>${t('删除行')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 禁止多选操作
                    let isMore = isMoreRowAction(editor)
                    if (isMore) {
                        return true
                    }
                    //当前元素
                    let selectDom = $(editor.selection.getSelectionStartElem())
                    //当前行
                    let $currentRow = getnode.getRowNode(selectDom.elems[0])
                    if (!$currentRow) {
                        return true
                    }
                    //获取当前行的index
                    const index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow))
                    //生成要替换的html
                    let htmlStr = getnode.getTableHtml($node.elems[0])
                    //获取新生成的table 判断是否是最后一行被删除 是 删除整个table
                    const trLength: number = operatingEvent.DeleteRow($(htmlStr), index).elems[0]
                        .childNodes[0].childNodes.length
                    //生成新的table
                    let newdom: string = ''
                    // 选中table
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()

                    if (trLength === 0) {
                        newdom = EMPTY_P
                    } else {
                        newdom = getnode.getTableHtml(
                            operatingEvent.DeleteRow($(htmlStr), index).elems[0]
                        )
                    }
                    editor.cmd.do('insertHTML', newdom)

                    return true
                },
            },
            {
                $elem: $(`<span>${t('添加列')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 禁止多选操作
                    let isMore = isMoreRowAction(editor)
                    if (isMore) {
                        return true
                    }
                    //当前元素
                    let selectDom = $(editor.selection.getSelectionStartElem())
                    //当前列的index
                    const index = getnode.getCurrentColIndex(selectDom.elems[0])
                    //生成要替换的html
                    let htmlStr = getnode.getTableHtml($node.elems[0])
                    //生成新的table
                    let newdom: string = getnode.getTableHtml(
                        operatingEvent.ProcessingCol($(htmlStr), index).elems[0]
                    )
                    // 选中table
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()

                    editor.cmd.do('insertHTML', newdom)

                    return true
                },
            },
            {
                $elem: $(`<span>${t('删除列')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 禁止多选操作
                    let isMore = isMoreRowAction(editor)
                    if (isMore) {
                        return true
                    }
                    //当前元素
                    let selectDom = $(editor.selection.getSelectionStartElem())
                    //当前列的index
                    const index = getnode.getCurrentColIndex(selectDom.elems[0])
                    //生成要替换的html
                    let htmlStr = getnode.getTableHtml($node.elems[0])
                    //获取新生成的table 判断是否是最后一列被删除 是 删除整个table
                    const tdLength: number = operatingEvent.DeleteCol($(htmlStr), index).elems[0]
                        .childNodes[0].childNodes[0].childNodes.length
                    //生成新的table
                    let newdom: string = ''
                    // 选中table
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()

                    if (tdLength === 1) {
                        newdom = EMPTY_P
                    } else {
                        newdom = getnode.getTableHtml(
                            operatingEvent.DeleteCol($(htmlStr), index).elems[0]
                        )
                    }

                    editor.cmd.do('insertHTML', newdom)

                    return true
                },
            },
            {
                $elem: $(`<span>${t('设置表头')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    // 禁止多选操作
                    let isMore = isMoreRowAction(editor)
                    if (isMore) {
                        return true
                    }
                    //当前元素
                    let selectDom = $(editor.selection.getSelectionStartElem())
                    //当前行
                    let $currentRow = getnode.getRowNode(selectDom.elems[0])
                    if (!$currentRow) {
                        return true
                    }
                    //获取当前行的index
                    let index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow))
                    if (index !== 0) {
                        //控制在table的第一行
                        index = 0
                    }
                    //生成要替换的html
                    let htmlStr = getnode.getTableHtml($node.elems[0])
                    //生成新的table
                    let newdom: string = getnode.getTableHtml(
                        operatingEvent.setTheHeader($(htmlStr), index, 'th').elems[0]
                    )
                    // 选中table
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()

                    editor.cmd.do('insertHTML', newdom)

                    return true
                },
            },
            {
                $elem: $(`<span>${t('取消表头')}</span>`),
                onClick: (editor: Editor, $node: DomElement) => {
                    //当前元素
                    let selectDom = $(editor.selection.getSelectionStartElem())
                    //当前行
                    let $currentRow = getnode.getRowNode(selectDom.elems[0])
                    if (!$currentRow) {
                        return true
                    }
                    //获取当前行的index
                    let index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow))
                    if (index !== 0) {
                        //控制在table的第一行
                        index = 0
                    }
                    //生成要替换的html
                    let htmlStr = getnode.getTableHtml($node.elems[0])
                    //生成新的table
                    let newdom: string = getnode.getTableHtml(
                        operatingEvent.setTheHeader($(htmlStr), index, 'td').elems[0]
                    )
                    // 选中table
                    editor.selection.createRangeByElem($node)
                    editor.selection.restoreSelection()

                    editor.cmd.do('insertHTML', newdom)

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
    function hideTableTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove()
            tooltip = null
        }
    }

    return {
        showTableTooltip,
        hideTableTooltip,
    }
}

/**
 * 判断是否是多行
 */
function isMoreRowAction(editor: Editor): boolean {
    const $startElem = editor.selection.getSelectionStartElem()
    const $endElem = editor.selection.getSelectionEndElem()
    if ($startElem?.elems[0] !== $endElem?.elems[0]) {
        return true
    } else {
        return false
    }
}

/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
export default function bindTooltipEvent(editor: Editor) {
    const { showTableTooltip, hideTableTooltip } = createShowHideFn(editor)

    // 点击table元素是，显示 tooltip
    editor.txt.eventHooks.tableClickEvents.push(showTableTooltip)

    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideTableTooltip)
    editor.txt.eventHooks.keyupEvents.push(hideTableTooltip)
    editor.txt.eventHooks.toolbarClickEvents.push(hideTableTooltip)
    editor.txt.eventHooks.menuClickEvents.push(hideTableTooltip)
    editor.txt.eventHooks.textScrollEvents.push(hideTableTooltip)
}
