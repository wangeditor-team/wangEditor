/**
 * @description 取消有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'
import updateRange from './update-range'

function cancelOrderNode($node: DomElement, editor: Editor): void {
    const html = $(
        $node
            .html()
            .replace(/<li>/gim, '<p>')
            .replace(/<\/li>/gim, '</p>')
    )

    html.insertAfter($node)
    $node.remove()
    updateRange(html, editor)
}

export default cancelOrderNode
