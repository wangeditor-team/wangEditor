/**
 * @description 设置无序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'
import updateRange from './update-range'

function setDisorderNode($node: DomElement, editor: Editor, type: string = 'p'): void {
    const html =
        type === 'p'
            ? $(`<ul data-list-level="1"><li>${$node.html()}</li></ul>`)
            : $(`<ul data-list-level="1">${$node.html()}</ul>`)
    html.insertAfter($node)
    $node.remove()
    updateRange(html, editor)
}

export default setDisorderNode
