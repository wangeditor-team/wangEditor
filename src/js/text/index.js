/*
    编辑区域
*/

import $ from '../util/dom-core.js'
import { getPasteText, getPasteHtml, getPasteImgs } from '../util/paste-handle.js'

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

    // 清空内容
    clear: function () {
        this.html('<p><br></p>')
    },

    // 获取 设置 html
    html: function (val) {
        const editor = this.editor
        const $textElem = editor.$textElem
        if (val == null) {
            return $textElem.html()
        } else {
            $textElem.html(val)
        }
    },

    // 获取 设置 text
    text: function (val) {
        const editor = this.editor
        const $textElem = editor.$textElem
        if (val == null) {
            return $textElem.text()
        } else {
            $textElem.text(`<p>${val}</p>`)
        }
    },

    // 追加内容
    append: function (html) {
        const editor = this.editor
        const $textElem = editor.$textElem
        $textElem.append($(html))
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

        // img 点击
        this._imgHandle()
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
            if (!$selectionElem) {
                return
            }
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

        $textElem.on('keydown', e => {
            if (e.keyCode !== 8) {
                return
            }
            const txtHtml = $textElem.html().toLowerCase().trim()
            if (txtHtml === '<p><br></p>') {
                // 最后剩下一个空行，就不再删除了
                e.preventDefault()
                return
            }
        })

        $textElem.on('keyup', e => {
            if (e.keyCode !== 8) {
                return
            }
            let $p
            const txtHtml = $textElem.html().toLowerCase().trim()

            // firefox 时用 txtHtml === '<br>' 判断，其他用 !txtHtml 判断
            if (!txtHtml || txtHtml === '<br>') {
                // 内容空了
                $p = $('<p><br/></p>')
                $textElem.html('') // 一定要先清空，否则在 firefox 下有问题
                $textElem.append($p)
                editor.selection.createRangeByElem($p, false, true)
                editor.selection.restoreSelection()
            }
        })

    },

    // 粘贴事件（粘贴文字 粘贴图片）
    _pasteHandle: function () {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 粘贴文字
        $textElem.on('paste', e => {
            // 阻止默认行为，使用 execCommand 的粘贴命令
            e.preventDefault()

            // 获取粘贴的文字
            let pasteText, pasteHtml

            const $selectionElem = editor.selection.getSelectionContainerElem()
            if (!$selectionElem) {
                return
            }
            const nodeName = $selectionElem.getNodeName()

            // code 中粘贴忽略
            if (nodeName === 'CODE' || nodeName === 'PRE') {
                return
            }

            // 表格中忽略，可能会出现异常问题
            if (nodeName === 'TD' || nodeName === 'TH') {
                return
            }

            if (nodeName === 'DIV' || $textElem.html() === '<p><br></p>') {
                // 是 div，可粘贴过滤样式的文字和链接

                pasteHtml = getPasteHtml(e)
                if (!pasteHtml) {
                    return
                }
                editor.cmd.do('insertHTML', pasteHtml)
            } else {
                // 不是 div，证明在已有内容的元素中粘贴，只粘贴纯文本

                pasteText = getPasteText(e)
                if (!pasteText) {
                    return
                }
                editor.cmd.do('insertHTML', `<p>${pasteText}</p>`)
            }
        })

        // 粘贴图片
        $textElem.on('paste', e => {
            e.preventDefault()

            // 获取粘贴的图片
            const pasteFiles = getPasteImgs(e)
            if (!pasteFiles || !pasteFiles.length) {
                return
            }

            // 获取当前的元素
            const $selectionElem = editor.selection.getSelectionContainerElem()
            if (!$selectionElem) {
                return
            }
            const nodeName = $selectionElem.getNodeName()

            // code 中粘贴忽略
            if (nodeName === 'CODE' || nodeName === 'PRE') {
                return
            }

            // 上传图片
            const uploadImg = editor.uploadImg
            uploadImg.uploadImg(pasteFiles)
        })
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
            if (!$selectionElem) {
                return
            }
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

    },

    // img 点击
    _imgHandle: function () {
        const editor = this.editor
        const $textElem = editor.$textElem
        const selectedClass = 'w-e-selected'

        // 为图片增加 selected 样式
        $textElem.on('click', 'img', function (e) {
            const img = this
            const $img = $(img)

            // 去掉所有图片的 selected 样式
            $textElem.find('img').removeClass(selectedClass)

            // 为点击的图片增加样式，并记录当前图片
            $img.addClass(selectedClass)
            editor._selectedImg = $img

            // 修改选取
            editor.selection.createRangeByElem($img)
        })

        // 去掉图片的 selected 样式
        $textElem.on('click  keyup', e => {
            if (e.target.matches('img')) {
                // 点击的是图片，忽略
                return
            }
            // 取消掉 selected 样式，并删除记录
            $textElem.find('img').removeClass(selectedClass)
            editor._selectedImg = null
        })
    }
}

export default Text