/**
 * @description 取消无序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'
import updateRange from './update-range'

function cancelDisOrderNode($node: DomElement, editor: Editor): void {
    let html: DomElement
    const $children = $($node.children())

    if ($children.length <= 1) {
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

export default cancelDisOrderNode
