/*
    编辑区域
*/

import $ from '../util/dom-core.js'

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

    // 获取 html
    getHTML: function () {
        // 检查所有顶级标签，看是否需要用 p 再包裹一遍（针对 div textNode）
    },

    // 获取 text
    getText: function () {

    },

    // 获取 json
    getJSON: function () {
        // 先获取 html 再处理成 JSON
    },

    // 绑定事件
    _bindEvent: function () {
        // 实时保存选取
        this._saveRangeRealTime()

        // 按回车建时的特殊处理
        this._enterKeyHandle()

        // 清空时保留 <p><br></p>
        this._clearHandle()

        // 粘贴事件（粘贴文字，粘贴图片）
        this._pasteHandle()

        // tab 特殊处理
        this._tabHandle()
    },

    // 实时保存选取
    _saveRangeRealTime: function () {
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
    },

    // 按回车键时的特殊处理
    _enterKeyHandle: function () {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 将回车之后生成的非 <p> 的顶级标签，改为 <p>
        function pHandle(e) {
            const $selectionElem = editor.selection.getSelectionContainerElem()
            const $parentElem = $selectionElem.parent()
            if (!$parentElem.equal($textElem)) {
                // 不是顶级标签
                return
            }
            const nodeName = $selectionElem.getNodeName()
            if (nodeName === 'P') {
                // 当前的标签是 P ，不用做处理
            }

            if ($selectionElem.text()) {
                // 有内容，不做处理
                return
            }

            // 插入 <p> ，并将选取定位到 <p>，删除当前标签
            const $p = $('<p><br></p>')
            $p.insertBefore($selectionElem)
            editor.selection.createRangeByElem($p, true)
            editor.selection.restoreSelection()
            $selectionElem.remove()
        }

        $textElem.on('keyup', e => {
            if (e.keyCode !== 13) {
                // 不是回车键
                return
            }
            // 将回车之后生成的非 <p> 的顶级标签，改为 <p>
            pHandle(e)
        })

        // <pre><code></code></pre> 回车时 特殊处理
        function codeHandle(e) {
            const $selectionElem = editor.selection.getSelectionContainerElem()
            const $parentElem = $selectionElem.parent()
            const selectionNodeName = $selectionElem.getNodeName()
            const parentNodeName = $parentElem.getNodeName()

            if (selectionNodeName !== 'CODE' || parentNodeName !== 'PRE') {
                // 不符合要求 忽略
                return
            }

            if (!editor.cmd.queryCommandSupported('insertHTML')) {
                // 必须原生支持 insertHTML 命令
                return
            }

            const _startOffset = editor.selection.getRange().startOffset
            editor.cmd.do('insertHTML', '\n')
            editor.selection.saveRange()
            if (editor.selection.getRange().startOffset === _startOffset) {
                // 没起作用，再来一遍
                editor.cmd.do('insertHTML', '\n')
            }

            // 阻止默认行为
            e.preventDefault()
        }

        $textElem.on('keydown', e => {
            if (e.keyCode !== 13) {
                // 不是回车键
                return
            }
            // <pre><code></code></pre> 回车时 特殊处理
            codeHandle(e)
        })
    },

    // 清空时保留 <p><br></p>
    _clearHandle: function () {
        const editor = this.editor
        const $textElem = editor.$textElem




    },

    // 粘贴事件（粘贴文字 粘贴图片）
    _pasteHandle: function () {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 如果在 <code> 中，要做特殊处理

    },

    // tab 特殊处理
    _tabHandle: function () {
        const editor = this.editor
        const $textElem = editor.$textElem

        $textElem.on('keydown', e => {
            if (e.keyCode !== 9) {
                return
            }
            if (!editor.cmd.queryCommandSupported('insertHTML')) {
                // 必须原生支持 insertHTML 命令
                return
            }
            const $selectionElem = editor.selection.getSelectionContainerElem()
            const $parentElem = $selectionElem.parent()
            const selectionNodeName = $selectionElem.getNodeName()
            const parentNodeName = $parentElem.getNodeName()

            if (selectionNodeName === 'CODE' && parentNodeName === 'PRE') {
                // <pre><code> 里面
                editor.cmd.do('insertHTML', '    ')
            } else {
                // 普通文字
                editor.cmd.do('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
            }

            e.preventDefault()
        })

    }
}

export default Text