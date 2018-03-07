/*
    selection range API
*/

import $ from '../util/dom-core.js'
import { UA } from '../util/util.js'

// 构造函数
function API(editor) {
    this.editor = editor
    this._currentRange = null
}

// 修改原型
API.prototype = {
    constructor: API,

    // 获取 range 对象
    getRange: function () {
        return this._currentRange
    },

    // 保存选区
    saveRange: function (_range) {
        if (_range) {
            // 保存已有选区
            this._currentRange = _range
            return
        }

        // 获取当前的选区
        const selection = window.getSelection()
        if (selection.rangeCount === 0) {
            return
        }
        const range = selection.getRangeAt(0)

        // 判断选区内容是否在编辑内容之内
        const $containerElem = this.getSelectionContainerElem(range)
        if (!$containerElem) {
            return
        }

        // 判断选区内容是否在不可编辑区域之内
        if ($containerElem.attr('contenteditable') === 'false' || $containerElem.parentUntil('[contenteditable=false]')) {
            return
        }

        const editor = this.editor
        const $textElem = editor.$textElem
        if ($textElem.isContain($containerElem)) {
            // 是编辑内容之内的
            this._currentRange = range
        }
    },

    // 折叠选区
    collapseRange: function (toStart) {
        if (toStart == null) {
            // 默认为 false
            toStart = false
        }
        const range = this._currentRange
        if (range) {
            range.collapse(toStart)
        }
    },

    // 选中区域的文字
    getSelectionText: function () {
        const range = this._currentRange
        if (range) {
            return this._currentRange.toString()
        } else {
            return ''
        }
    },

    // 选区的 $Elem
    getSelectionContainerElem: function (range) {
        range = range || this._currentRange
        let elem
        if (range) {
            elem = range.commonAncestorContainer
            return $(
                elem.nodeType === 1 ? elem : elem.parentNode
            )
        }
    },
    getSelectionStartElem: function (range) {
        range = range || this._currentRange
        let elem
        if (range) {
            elem = range.startContainer
            return $(
                elem.nodeType === 1 ? elem : elem.parentNode
            )
        }
    },
    getSelectionEndElem: function (range) {
        range = range || this._currentRange
        let elem
        if (range) {
            elem = range.endContainer
            return $(
                elem.nodeType === 1 ? elem : elem.parentNode
            )
        }
    },

    // 选区是否为空
    isSelectionEmpty: function () {
        const range = this._currentRange
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true
                }
            }
        }
        return false
    },

    // 恢复选区
    restoreSelection: function () {
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(this._currentRange)
    },

    // 创建一个空白（即 &#8203 字符）选区
    createEmptyRange: function () {
        const editor = this.editor
        const range = this.getRange()
        let $elem

        if (!range) {
            // 当前无 range
            return
        }
        if (!this.isSelectionEmpty()) {
            // 当前选区必须没有内容才可以
            return
        }

        try {
            // 目前只支持 webkit 内核
            if (UA.isWebkit()) {
                // 插入 &#8203
                editor.cmd.do('insertHTML', '&#8203;')
                // 修改 offset 位置
                range.setEnd(range.endContainer, range.endOffset + 1)
                // 存储
                this.saveRange(range)
            } else {
                $elem = $('<strong>&#8203;</strong>')
                editor.cmd.do('insertElem', $elem)
                this.createRangeByElem($elem, true)
            }
        } catch (ex) {
            // 部分情况下会报错，兼容一下
        }
    },

    // 根据 $Elem 设置选区
    createRangeByElem: function ($elem, toStart, isContent) {
        // $elem - 经过封装的 elem
        // toStart - true 开始位置，false 结束位置
        // isContent - 是否选中Elem的内容
        if (!$elem.length) {
            return
        }

        const elem = $elem[0]
        const range = document.createRange()

        if (isContent) {
            range.selectNodeContents(elem)
        } else {
            range.selectNode(elem)
        }

        if (typeof toStart === 'boolean') {
            range.collapse(toStart)
        }

        // 存储 range
        this.saveRange(range)
    }
}

export default API