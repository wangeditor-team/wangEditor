/**
 * @description 设置有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'

function setOrderNode($node: DomElement, editor: Editor): void {
    const html = `<ol data-list-level="1"><li>${$node.html()}</li></ol>`
    editor.cmd.do('insertHTML', html)
    $node.remove()
}

export default setOrderNode
