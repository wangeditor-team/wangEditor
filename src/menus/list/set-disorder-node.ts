/**
 * @description 设置无序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'
import updateRange from './update-range'

function setDisorderNode($node: DomElement, editor: Editor, type: string = 'p'): void {
    const reg = /^UL$/i
    const $prev = $node.prev()
    const $next = $node.next()

    let html: DomElement
    if ($prev.length > 0 && reg.test($prev.getNodeName())) {
        html = type === 'p' ? $(`<li>${$node.html()}</li>`) : $($node.html())
        $prev.append(html)
    } else if ($next.length > 0 && reg.test($next.getNodeName())) {
        html = type === 'p' ? $(`<li>${$node.html()}</li>`) : $($node.html())
        $next.children()?.insertBefore(html)
    } else {
        html =
            type === 'p'
                ? $(`<ul data-list-level="1"><li>${$node.html()}</li></ul>`)
                : $(`<ul data-list-level="1">${$node.html()}</ul>`)
        html.insertAfter($node)
    }
    $node.remove()
    updateRange(html, editor)
}

export default setDisorderNode
