/*
    selection range API
*/

// 构造函数
function API(editor) {
    this.editor = editor
    this.currentRange = null
}

// 修改原型
API.prototype = {
    constructor: API,

    // 设置选区
    setSelection: function (range) {
        if (range) {
            this.currentRange = range
        } else {
            this.currentRange = window.getSelection()
        }
    },

    // 选中区域的文字
    getSelectionText: function () {

    },

    // 选区的 Elem
    getSelectionElem: function () {

    },

    // 恢复选区
    restoreSelection: function () {

    }
}

export default API