/**
 * @description 获取当前 节点 的段落
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'

function getParagraph($node: DomElement, editor: Editor): DomElement {
    const $parent = $node.parent()
    if (editor.$textElem.equal($parent)) {
        return $node
    } else {
        return getParagraph($parent, editor)
    }
}

export default getParagraph
