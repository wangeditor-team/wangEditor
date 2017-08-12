/*
    menu - quote
*/
import $ from '../../util/dom-core.js'
import { UA } from '../../util/util.js'

// 构造函数
function Quote(editor) {
    this.editor = editor
    this.$elem = $(
        `<div class="w-e-menu">
            <i class="w-e-icon-quotes-left"><i/>
        </div>`
    )
    this.type = 'click'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Quote.prototype = {
    constructor: Quote,

    onClick: function (e) {
        const editor = this.editor
        if (!UA.isIE()) {
            editor.cmd.do('formatBlock', '<BLOCKQUOTE>')
            return
        }
        
        // IE 中不支持 formatBlock <BLOCKQUOTE> ，要用其他方式兼容

        const $selectionElem = editor.selection.getSelectionContainerElem()
        let content, $targetELem
        if ($selectionElem.getNodeName() === 'P') {
            // 将 P 转换为 quote
            content = $selectionElem.text()
            $targetELem = $(`<blockquote>${content}</blockquote>`)
            $targetELem.insertAfter($selectionElem)
            $selectionElem.remove()
            return
        }
        if ($selectionElem.getNodeName() === 'BLOCKQUOTE') {
            // 撤销 quote
            content = $selectionElem.text()
            $targetELem = $(`<p>${content}</p>`)
            $targetELem.insertAfter($selectionElem)
            $selectionElem.remove()
        }
    },

    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        const reg = /^BLOCKQUOTE$/i
        const cmdValue = editor.cmd.queryCommandValue('formatBlock')
        if (reg.test(cmdValue)) {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Quote