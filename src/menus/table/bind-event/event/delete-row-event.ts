import Editor from '../../../../editor/index'
import $, { DomElement } from '../../../../utils/dom-core'

export const deleteRowEvent = {
    $elem: $('<span>删除行</span>'),
    onClick: (editor: Editor, $node: DomElement) => {
        // 选中img元素
        editor.selection.createRangeByElem($node)
        editor.selection.restoreSelection()

        // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
        return true
    },
}
