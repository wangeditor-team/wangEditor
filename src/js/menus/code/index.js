/*
    menu - code
*/
import $ from '../../util/dom-core.js'

// 构造函数
function Code(editor) {
    this.editor = editor
    this.$elem = $(
        `<div class="w-e-menu">
            <i class="w-e-icon-terminal"><i/>
        </div>`
    )
    this.type = 'click'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Code.prototype = {
    constructor: Code,

    onClick: function (e) {
        const editor = this.editor
        const $startElem = editor.selection.getSelectionStartElem()
        const $endElem = editor.selection.getSelectionEndElem()
        const isSeleEmpty = editor.selection.isSelectionEmpty()
        const selectionText = editor.selection.getSelectionText()
        let $code

        if (!$startElem.equal($endElem)) {
            // 跨元素选择，不做处理
            return
        }

        if (isSeleEmpty) {
            // 无选中内容
            $code = $(`<pre><code><br></code></pre>`)
            editor.cmd.do('insertElem', $code)
        } else {
            // 有选中内容
            $code = $(`<code>${selectionText}</code>`)
            editor.cmd.do('insertElem', $code)
        }
        editor.selection.createRangeByElem($code, true)
        editor.selection.restoreSelection()
    }
}

export default Code