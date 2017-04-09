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

        // 保存当前的选区
        function saveRange(e) {
            // 随时保存选区
            editor.selection.saveRange()
            // 更新按钮 ative 状态
            editor.menus.changeActive()
        }
        // 按键后保存
        $textElem.on('keyup', saveRange)
        $textElem.on('mousedown', e => {
            // mousedown 状态下，鼠标滑动到编辑区域外面，也需要保存选区
            $textElem.on('mouseleave', saveRange)
        })
        $textElem.on('mouseup', e => {
            saveRange()
            // 在编辑器区域之内完成点击，取消鼠标滑动到编辑区外面的事件
            $textElem.off('mouseleave', saveRange)
        })
    }
}

export default Text