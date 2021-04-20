/**
 * @description 删除时保留 EMPTY_P
 * @author wangfupeng
 */

import { EMPTY_P } from '../../utils/const'
import Editor from '../../editor/index'
import $ from '../../utils/dom-core'

/**
 * 删除时保留 EMPTY_P
 * @param editor 编辑器实例
 * @param deleteUpEvents delete 键 up 时的 hooks
 * @param deleteDownEvents delete 建 down 时的 hooks
 */
function deleteToKeepP(editor: Editor, deleteUpEvents: Function[], deleteDownEvents: Function[]) {
    function upFn() {
        const $textElem = editor.$textElem
        // 增加.replace(/<.*\><br><\/.*>/g, '') 为了解决粘贴内容时增加的<xxx><br></xxx>格式的内容无法删除，导致出现无法删除干净内容的问题。
        const txtHtml = $textElem.html().toLowerCase().trim().replace(/<.*\><br><\/.*>/g, '')

        // firefox 时用 txtHtml === '<br>' 判断，其他用 !txtHtml 判断
        if (!txtHtml || txtHtml === '<br>') {
            // 内容空了
            const $p = $(EMPTY_P)
            $textElem.html(' ') // 一定要先清空，否则在 firefox 下有问题
            $textElem.append($p)
            editor.selection.createRangeByElem($p, false, true)
            editor.selection.restoreSelection()
            // 设置折叠后的光标位置，在firebox等浏览器下
            // 光标设置在end位置会自动换行
            editor.selection.moveCursor($p.getNode(), 0)
        }
    }
    deleteUpEvents.push(upFn)

    function downFn(e: Event) {
        const $textElem = editor.$textElem
        const txtHtml = $textElem.html().toLowerCase().trim()
        if (txtHtml === EMPTY_P) {
            // 最后剩下一个空行，就不再删除了
            e.preventDefault()
            return
        }
    }
    deleteDownEvents.push(downFn)
}

export default deleteToKeepP
