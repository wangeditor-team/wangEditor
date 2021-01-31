/**
 * @description 保证table后面始终有dom
 * @author yanbiao(86driver)
 */
import Editor from '../../../editor/index'
import GetNode from './event/getNode'

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

            const key = e.key
            const isArrowKey = key === 'ArrowUp' || key === 'ArrowDown'

            if (!$topElem?.elems.length) return

            if ($topElem.getNodeName() === 'TABLE' && isArrowKey) {
                e.preventDefault()

                const containerElem = $selectionContainerElem.elems[0]
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

                const nextCursorNode = nextRow.childNodes[colIndex]
                editor.selection.moveCursor(nextCursorNode)
            }
        }
    })
}
