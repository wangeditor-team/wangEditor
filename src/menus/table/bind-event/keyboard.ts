/**
 * @description 保证table后面始终有dom
 * @author yanbiao(86driver)
 */
import Editor from '../../../editor/index'
import GetNode from './event/getNode'
import { UA } from '../../../utils/util'

/**
 * 获取表格所有的行
 * @param tableNode 当前table
 */
function getTableRows(tableNode: HTMLTableElement) {
    const firstNode = tableNode.firstChild
    if (firstNode == null) return []

    const tableBody = firstNode.nodeName === 'COLGROUP' ? tableNode.lastChild : firstNode
    if (tableBody == null) return []

    return tableBody.childNodes?.length ? tableBody.childNodes : []
}

export default function bindEventKeyboardEvent(editor: Editor) {
    const { txt, selection } = editor
    const { keydownEvents } = txt.eventHooks
    const getNodeUtils = new GetNode(editor)

    keydownEvents.push(function (e) {
        // 实时保存选区
        editor.selection.saveRange()
        const $selectionContainerElem = selection.getSelectionContainerElem()
        if ($selectionContainerElem) {
            const $topElem = $selectionContainerElem.getNodeTop(editor)
            const $preElem = $topElem.length
                ? $topElem.prev().length
                    ? $topElem.prev()
                    : null
                : null
            if ($preElem && $preElem.getNodeName() === 'TABLE') {
                // 光标处于选区开头
                if (selection.getCursorPos() === 0) {
                    // 按下delete键阻止默认行为
                    if (e.keyCode === 8) {
                        e.preventDefault()
                    }
                }
            }

            // 火狐行为正常，不需要处理
            if (UA.isFirefox) return

            const key = e.key
            const isArrowKey = key === 'ArrowUp' || key === 'ArrowDown'

            if (!$topElem?.elems.length) return

            if ($topElem.getNodeName() === 'TABLE' && isArrowKey) {
                const selection = window.getSelection()
                const anchorNode = selection?.anchorNode

                const containerElem = $selectionContainerElem.elems[0]
                const containerChildren = containerElem.childNodes
                const hasBr = !!Array.prototype.slice
                    .call(containerChildren)
                    .find(node => node.nodeName === 'BR')

                const topElem = $topElem.elems[0]
                if (containerElem == null || topElem == null) return

                const row = getNodeUtils.getRowNode(containerElem)
                if (row == null) return

                // 获取当前选区元素所在的行号和列号
                const rowIndex = getNodeUtils.getCurrentRowIndex(topElem, row)
                const colIndex = getNodeUtils.getCurrentColIndex(containerElem)
                // 获取表格当前所有的行
                const tableRows = getTableRows(topElem as HTMLTableElement)
                if (tableRows.length === 0) return

                // 光标下一个需要移动到的dom
                const offset = key === 'ArrowUp' ? -1 : 1

                // 单元格有多行元素，1.如果是上移，并且光标位置不是第一个子元素 2.如果是下移，并且光标位置不是最后一个子元素，直接返回
                if (hasBr) {
                    if (
                        (offset === -1 && anchorNode !== containerChildren[0]) ||
                        (offset === 1 &&
                            anchorNode !== containerChildren[containerChildren.length - 1])
                    ) {
                        return
                    }
                }

                // 接下来阻止默认行为，自定义光标移动行为
                e.preventDefault()
                const nextRow = tableRows[rowIndex + offset]

                if (nextRow == null) {
                    // 如果当前是最后一行，跳出表格
                    if (offset === 1) {
                        if (topElem.nextSibling != null) {
                            editor.selection.moveCursor(topElem.nextSibling)
                        }
                    }
                    return
                }

                let nextCursorNode = nextRow.childNodes[colIndex]
                const nextNodeHasBr = !!Array.prototype.slice
                    .call(nextCursorNode.childNodes)
                    .find(node => node.nodeName === 'BR')
                // 如果跳到的下一行有多行元素，当上移则跳到最后一个子元素，下移跳转到一个子元素
                if (nextNodeHasBr) {
                    const { firstChild, lastChild } = nextCursorNode
                    nextCursorNode = (offset === -1 ? lastChild : firstChild) ?? nextCursorNode
                }
                editor.selection.moveCursor(nextCursorNode)
            }
        }
    })
}
