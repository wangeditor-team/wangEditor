/**
 * @description 设置无序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'

function setDisorderNode($node: DomElement, editor: Editor): void {
    const html = `<ul data-list-level="1"><li>${$node.html()}</li></ul>`
    editor.cmd.do('insertHTML', html)
    $node.remove()
}

export default setDisorderNode
