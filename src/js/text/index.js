/*
    编辑区域
*/

// 构造函数
function Text(editor) {
    this.editor = editor
}

// 修改原型
Text.prototype = {
    constructor: Text,

    // 初始化
    init: function () {
        // 绑定事件
        this._bindEvent()
    },

    // 绑定事件
    _bindEvent: function () {

    }
}

export default Text