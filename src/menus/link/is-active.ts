/**
 * @description 检查选区是否在链接中，即菜单是否应该 active
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { getTopLinkNode } from './util';

function isActive(editor: Editor): boolean {
    let $selectionELem = editor.selection.getSelectionContainerElem()
    if (!$selectionELem?.length) {
        return false
    }
    $selectionELem = getTopLinkNode($selectionELem)
    if ($selectionELem.getNodeName() === 'A') {
        return true
    } else {
        return false
    }
}

export default isActive
