/*
    menu - link
*/
import $ from '../util/dom-core.js'
import Panel from './panel/index.js'

// 构造函数
function Link(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"><i/></div>')
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false

    // 初始化 Panel
    this.panel = new Panel()
}

// 原型
Link.prototype = {
    constructor: Link,

    // 试图改变 active 状态
    tryChangeActive: function (e) {

    }
}

export default Link