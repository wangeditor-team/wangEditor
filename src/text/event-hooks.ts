/**
 * @description Text 事件钩子函数。Text 公共的，不是某个菜单独有的
 * @wangfupeng
 */

import Text from './index'
import Editor from '../editor/index'
import $, { DomElement } from '../utils/dom-core'

/**
 * 初始化 text 事件钩子函数
 * @param text text 实例
 */
function initTextHooks(text: Text): void {
    const editor = text.editor
    const eventHooks = text.eventHooks

    // 回车时，保证生成的是 <p> 标签
    _enterToCreateP(editor, eventHooks.enterUpEvents)

    // 删除时，保留 <p><br></p>
    _deleteToKeepP(editor, eventHooks.deleteUpEvents, eventHooks.deleteDownEvents)
}

/**
 * 回车时，保证生成的是 <p> 标签
 * @param editor 编辑器实例
 * @param enterUpEvents enter 键 up 时的 hooks
 */
function _enterToCreateP(editor: Editor, enterUpEvents: Function[]) {
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

/**
 * 删除时保留 <p><br></p>
 * @param editor 编辑器实例
 * @param deleteUpEvents delete 键 up 时的 hooks
 * @param deleteDownEvents delete 建 down 时的 hooks
 */
function _deleteToKeepP(editor: Editor, deleteUpEvents: Function[], deleteDownEvents: Function[]) {
    function upFn() {
        const $textElem = editor.$textElem
        const txtHtml = $textElem.html().toLowerCase().trim()

        // firefox 时用 txtHtml === '<br>' 判断，其他用 !txtHtml 判断
        if (!txtHtml || txtHtml === '<br>') {
            // 内容空了
            const $p = $('<p><br/></p>')
            $textElem.html('') // 一定要先清空，否则在 firefox 下有问题
            $textElem.append($p)
            editor.selection.createRangeByElem($p, false, true)
            editor.selection.restoreSelection()
        }
    }
    deleteUpEvents.push(upFn)

    function downFn(e: Event) {
        const $textElem = editor.$textElem
        const txtHtml = $textElem.html().toLowerCase().trim()
        if (txtHtml === '<p><br></p>') {
            // 最后剩下一个空行，就不再删除了
            e.preventDefault()
            return
        }
    }
    deleteDownEvents.push(downFn)
}

export default initTextHooks
