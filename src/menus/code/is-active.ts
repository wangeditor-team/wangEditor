/**
 * @description 检查选区是否在代码中，即菜单是否应该 active
 * @author lkw
 */

import Editor from '../../editor/index'

function isActive(editor: Editor): boolean {
    const $selectionELem = editor.selection.getSelectionContainerElem()
    if (!$selectionELem) {
        return false
    }
    if (
        $selectionELem.getNodeName() == 'CODE' ||
        $selectionELem.getNodeName() == 'PRE' ||
        $selectionELem.parent().getNodeName() == 'CODE' ||
        $selectionELem.parent().getNodeName() == 'PRE' ||
        $selectionELem.parent().attr('class') == 'hljs-tag' ||
        $selectionELem.attr('class') == 'hljs-attribute'
    ) {
        return true
    } else {
        return false
    }
}

export default isActive
