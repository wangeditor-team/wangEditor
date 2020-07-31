/**
 * @description 设置有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'
import updateRange from './update-range'

function setOrderNode($node: DomElement, editor: Editor, type: string = 'p'): void {
    const html =
        type === 'p'
            ? $(`<ol data-list-level="1"><li>${$node.html()}</li></ol>`)
            : $(`<ol data-list-level="1">${$node.html()}</ol>`)
    html.insertAfter($node)
    $node.remove()
    updateRange(html, editor)
}

export default setOrderNode
