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
        const editor = this.editor
        const $textElem = editor.$textElem

        // 点击或者按键时触发
        function onClickAndKeyup(e) {

            // 记录内容用于撤销

            // 触发 onchange 函数

            // 随时保存选区
            editor.selection.saveRange()

            // 更新按钮 ative 状态
            editor.menus.changeActive()
        }
        $textElem.on('keyup', onClickAndKeyup)
        $textElem.on('click', onClickAndKeyup)
    }
}

export default Text