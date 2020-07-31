import Editor from '../../editor'
import { DomElement } from '../../utils/dom-core'

function updateRange($node: DomElement, editor: Editor) {
    editor.selection.createRangeByElem($node, false, true)
}

export default updateRange
