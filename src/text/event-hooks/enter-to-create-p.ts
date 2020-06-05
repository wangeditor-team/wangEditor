/**
 * @description 回车时，保证生成的是 <p> 标签
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'

/**
 * 回车时，保证生成的是 <p> 标签
 * @param editor 编辑器实例
 * @param enterUpEvents enter 键 up 时的 hooks
 */
function enterToCreateP(editor: Editor, enterUpEvents: Function[]) {
    function insertEmptyP($selectionElem: DomElement) {
        const $p = $('<p><br></p>')
        $p.insertBefore($selectionElem)
        editor.selection.createRangeByElem($p, true)
        editor.selection.restoreSelection()
        $selectionElem.remove()
    }

    function fn() {
        const $textElem = editor.$textElem
        const $selectionElem = editor.selection.getSelectionContainerElem() as DomElement
        const $parentElem = $selectionElem.parent()

        if ($parentElem.html() === '<code><br></code>') {
            // 回车之前光标所在一个 <p><code>.....</code></p> ，忽然回车生成一个空的 <p><code><br></code></p>
            // 而且继续回车跳不出去，因此只能特殊处理
            insertEmptyP($selectionElem)
            return
        }

        if (!$parentElem.equal($textElem)) {
            // 不是顶级标签
            return
        }

        const nodeName = $selectionElem.getNodeName()
        if (nodeName === 'P') {
            // 当前的标签是 P ，不用做处理
            return
        }

        if ($selectionElem.text()) {
            // 有内容，不做处理
            return
        }

        // 插入 <p> ，并将选取定位到 <p>，删除当前标签
        insertEmptyP($selectionElem)
    }

    // 添加到 hook
    enterUpEvents.push(fn)
}

export default enterToCreateP
