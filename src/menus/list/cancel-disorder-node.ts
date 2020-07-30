/**
 * @description 取消无序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'

function cancelDisOrderNode($node: DomElement, editor: Editor): void {
    const html = $node
        .html()
        .replace(/<li>/gim, '<p>')
        .replace(/<\/li>/gim, '</p>')
    editor.cmd.do('insertHTML', html)
    $node.remove()
}

export default cancelDisOrderNode
