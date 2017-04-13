/*
    menu - quote
*/
import $ from '../../util/dom-core.js'

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
        editor.cmd.do('formatBlock', '<BLOCKQUOTE>')
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