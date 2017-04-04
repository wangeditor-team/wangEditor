/*
    bold-menu
*/
import $ from '../util/dom-core.js'

// 构造函数
function Bold(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-bold"><i/></div>')
    this.type = 'click'

    // 当前是否 active 状态
    this.active = false
}

// 原型
Bold.prototype = {
    constructor: Bold,

    // 点击事件
    onClick: function (e) {

    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {

    }
}

export default Bold