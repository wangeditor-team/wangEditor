/*
    编辑区域左下角的提示条
*/

import $ from '../../util/dom-core.js'

// 构造函数
function Bar(editor) {
    this.editor = editor
}

// 原型
Bar.prototype = {
    constructor: Bar,

    // 初始化
    init: function () {
        const editor = this.editor
        const $textContainer = editor.$textContainerElem
        const $bar = $('<div class="w-e-bar"></div>')
        $textContainer.append($bar)

        // 记录属性
        this.$bar = $bar
    },

    // 显示一次
    showOnce: function (info) {
        this.show(info)

        setTimeout(() => {
            this.hide()
        }, 1500)
    },

    // 显示文字
    show: function (info) {
        const $bar = this.$bar
        $bar.text(info)
        $bar.show()
    },

    // 隐藏
    hide: function () {
        const $bar = this.$bar
        $bar.hide()
    }
}

export default Bar
