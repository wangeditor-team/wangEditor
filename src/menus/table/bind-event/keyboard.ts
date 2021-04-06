/**
 * @description 保证table后面始终有dom
 * @author yanbiao(86driver)
 */
import Editor from '../../../editor/index'
import { DomElement } from '../../../utils/dom-core'

/**
 * @description 是否是空行
 * @param topElem
 */
function isEmptyLine(topElem: DomElement): boolean {
    if (!topElem.length) {
        return false
    }

    const dom = topElem.elems[0]

    return dom.nodeName === 'P' && dom.innerHTML === '<br>'
}

export default function bindEventKeyboardEvent(editor: Editor) {
    const { txt, selection } = editor
    const { keydownEvents } = txt.eventHooks

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

            // 删除时，选区前面是table，且选区没有选中文本，阻止默认行为
            if (
                $preElem &&
                $preElem.getNodeName() === 'TABLE' &&
                selection.isSelectionEmpty() &&
                selection.getCursorPos() === 0 &&
                e.keyCode === 8
            ) {
                const $nextElem = $topElem.next()
                const hasNext = !!$nextElem.length

                /**
                 * 如果当前是空行，并且当前行下面还有内容，删除当前行
                 * 浏览器默认行为不会删除掉当前行的<br>标签
                 * 因此阻止默认行为，特殊处理
                 */
                if (hasNext && isEmptyLine($topElem)) {
                    $topElem.remove()
                    editor.selection.setRangeToElem($nextElem.elems[0])
                }
                e.preventDefault()
            }
        }
    })
}
