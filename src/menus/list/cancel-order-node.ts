/**
 * @description 取消有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'
import updateRange from './update-range'

function cancelOrderNode($node: DomElement, editor: Editor): void {
    let html: DomElement
    const $children = $($node.children())

    if ($children.length <= 0) {
        html = $(
            $node
                .html()
                .replace(/<li>/gim, '<p>')
                .replace(/<\/li>/gim, '</p>')
        )

        html.insertAfter($node)
        $node.remove()
        updateRange(html, editor)
    }
}

export default cancelOrderNode
