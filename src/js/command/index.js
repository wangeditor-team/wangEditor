/*
    命令，封装 document.execCommand
*/

import $ from '../util/dom-core.js'
import { UA } from '../util/util.js'

// 构造函数
function Command(editor) {
    this.editor = editor
}

// 修改原型
Command.prototype = {
    constructor: Command,

    // 执行命令
    do: function (name, value) {
        const editor = this.editor

        // 使用 styleWithCSS
        if (!editor._useStyleWithCSS) {
            document.execCommand('styleWithCSS', null, true)
            editor._useStyleWithCSS = true
        }

        // 如果无选区，忽略
        if (!editor.selection.getRange()) {
            return
        }

        // 恢复选取
        editor.selection.restoreSelection()

        // 执行
        const _name = '_' + name
        if (this[_name]) {
            // 有自定义事件
            this[_name](value)
        } else {
            // 默认 command
            this._execCommand(name, value)
        }

        // 修改菜单状态
        editor.menus.changeActive()

        // 最后，恢复选取保证光标在原来的位置闪烁
        editor.selection.saveRange()
        editor.selection.restoreSelection()

        // 触发 onchange
        editor.change && editor.change()
    },

    // 自定义 insertHTML 事件
    _insertHTML: function (html) {
        const editor = this.editor
        const range = editor.selection.getRange()

        if (this.queryCommandSupported('insertHTML')) {
            // W3C
            this._execCommand('insertHTML', html)
        } else if (range.insertNode) {
            // IE
            range.deleteContents()
            range.insertNode($(html)[0])
        } else if (range.pasteHTML) {
            // IE <= 10
            range.pasteHTML(html)
        } 
    },

    // 插入 elem
    _insertElem: function ($elem) {
        const editor = this.editor
        const range = editor.selection.getRange()

        if (range.insertNode) {
            range.deleteContents()
            range.insertNode($elem[0])
        }
    },

    // 封装 execCommand
    _execCommand: function (name, value) {
        document.execCommand(name, false, value)
    },

    // 封装 document.queryCommandValue
    queryCommandValue: function (name) {
        return document.queryCommandValue(name)
    },

    // 封装 document.queryCommandState
    queryCommandState: function (name) {
        return document.queryCommandState(name)
    },

    // 封装 document.queryCommandSupported
    queryCommandSupported: function (name) {
        return document.queryCommandSupported(name)
    }
}

export default Command