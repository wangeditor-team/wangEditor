/*
    编辑区域
*/

import $ from '../util/dom-core.js'
import { getPasteText, getPasteHtml, getPasteImgs } from '../util/paste-handle.js'
import { UA, isFunction, replaceHtmlSymbol } from '../util/util.js'

// 获取一个 elem.childNodes 的 JSON 数据
function getChildrenJSON($elem) {
    const result = []
    const $children = $elem.childNodes() || [] // 注意 childNodes() 可以获取文本节点
    $children.forEach(curElem => {
        let elemResult
        const nodeType = curElem.nodeType

        // 文本节点
        if (nodeType === 3) {
            elemResult = curElem.textContent
            elemResult = replaceHtmlSymbol(elemResult)
        }

        // 普通 DOM 节点
        if (nodeType === 1) {
            elemResult = {}

            // tag
            elemResult.tag = curElem.nodeName.toLowerCase()
            // attr
            const attrData = []
            const attrList = curElem.attributes || {}
            const attrListLength = attrList.length || 0
            for (let i = 0; i < attrListLength; i++) {
                const attr = attrList[i]
                attrData.push({
                    name: attr.name,
                    value: attr.value
                })
            }
            elemResult.attrs = attrData
            // children（递归）
            elemResult.children = getChildrenJSON($(curElem))
        }

        result.push(elemResult)
    })
    return result
}

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
        let html
        if (val == null) {
            html = $textElem.html()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            html = html.replace(/\u200b/gm, '')
            return html
        } else {
            $textElem.html(val)

            // 初始化选取，将光标定位到内容尾部
            editor.initSelection()
        }
    },

    // 获取 JSON
    getJSON: function () {
        const editor = this.editor
        const $textElem = editor.$textElem
        return getChildrenJSON($textElem)
    },

    // 获取 设置 text
    text: function (val) {
        const editor = this.editor
        const $textElem = editor.$textElem
        let text
        if (val == null) {
            text = $textElem.text()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            text = text.replace(/\u200b/gm, '')
            return text
        } else {
            $textElem.text(`<p>${val}</p>`)

            // 初始化选取，将光标定位到内容尾部
            editor.initSelection()
        }
    },

    // 追加内容
    append: function (html) {
        const editor = this.editor
        const $textElem = editor.$textElem
        $textElem.append($(html))

        // 初始化选取，将光标定位到内容尾部
        editor.initSelection()
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

        // 拖拽事件
        this._dragHandle()
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

        function insertEmptyP ($selectionElem) {
            const $p = $('<p><br></p>')
            $p.insertBefore($selectionElem)
            editor.selection.createRangeByElem($p, true)
            editor.selection.restoreSelection()
            $selectionElem.remove()
        }

        // 将回车之后生成的非 <p> 的顶级标签，改为 <p>
        function pHandle(e) {
            const $selectionElem = editor.selection.getSelectionContainerElem()
            const $parentElem = $selectionElem.parent()

            if ($parentElem.html() === '<code><br></code>') {
                // 回车之前光标所在一个 <p><code>.....</code></p> ，忽然回车生成一个空的 <p><code><br></code></p>
                // 而且继续回车跳不出去，因此只能特殊处理
                insertEmptyP($selectionElem)
                return
            }

            if (!$parentElem.equal($textElem)) {
                // 不是顶级标签
                return
            }

            const nodeName = $selectionElem.getNodeName()
            if (nodeName === 'P') {
                // 当前的标签是 P ，不用做处理
                return
            }

            if ($selectionElem.text()) {
                // 有内容，不做处理
                return
            }

            // 插入 <p> ，并将选取定位到 <p>，删除当前标签
            insertEmptyP($selectionElem)
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

            // 处理：光标定位到代码末尾，联系点击两次回车，即跳出代码块
            if (editor._willBreakCode === true) {
                // 此时可以跳出代码块
                // 插入 <p> ，并将选取定位到 <p>
                const $p = $('<p><br></p>')
                $p.insertAfter($parentElem)
                editor.selection.createRangeByElem($p, true)
                editor.selection.restoreSelection()

                // 修改状态
                editor._willBreakCode = false

                e.preventDefault()
                return
            }

            const _startOffset = editor.selection.getRange().startOffset

            // 处理：回车时，不能插入 <br> 而是插入 \n ，因为是在 pre 标签里面
            editor.cmd.do('insertHTML', '\n')
            editor.selection.saveRange()
            if (editor.selection.getRange().startOffset === _startOffset) {
                // 没起作用，再来一遍
                editor.cmd.do('insertHTML', '\n')
            }

            const codeLength = $selectionElem.html().length
            if (editor.selection.getRange().startOffset + 1 === codeLength) {
                // 说明光标在代码最后的位置，执行了回车操作
                // 记录下来，以便下次回车时候跳出 code
                editor._willBreakCode = true
            }

            // 阻止默认行为
            e.preventDefault()
        }

        $textElem.on('keydown', e => {
            if (e.keyCode !== 13) {
                // 不是回车键
                // 取消即将跳转代码块的记录
                editor._willBreakCode = false
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
        const config = editor.config
        const pasteFilterStyle = config.pasteFilterStyle
        const pasteTextHandle = config.pasteTextHandle
        const ignoreImg = config.pasteIgnoreImg
        const $textElem = editor.$textElem

        // 粘贴图片、文本的事件，每次只能执行一个
        // 判断该次粘贴事件是否可以执行
        let pasteTime = 0
        function canDo() {
            var now = Date.now()
            var flag = false
            if (now - pasteTime >= 100) {
                // 间隔大于 100 ms ，可以执行
                flag = true
            }
            pasteTime = now
            return flag
        }
        function resetTime() {
            pasteTime = 0
        }

        // 粘贴文字
        $textElem.on('paste', e => {
            if (UA.isIE()) {
                return
            } else {
                // 阻止默认行为，使用 execCommand 的粘贴命令
                e.preventDefault()
            }

            // 粘贴图片和文本，只能同时使用一个
            if (!canDo()) {
                return
            }

            // 获取粘贴的文字
            let pasteHtml = getPasteHtml(e, pasteFilterStyle, ignoreImg)
            let pasteText = getPasteText(e)
            pasteText = pasteText.replace(/\n/gm, '<br>')

            const $selectionElem = editor.selection.getSelectionContainerElem()
            if (!$selectionElem) {
                return
            }
            const nodeName = $selectionElem.getNodeName()

            // code 中只能粘贴纯文本
            if (nodeName === 'CODE' || nodeName === 'PRE') {
                if (pasteTextHandle && isFunction(pasteTextHandle)) {
                    // 用户自定义过滤处理粘贴内容
                    pasteText = '' + (pasteTextHandle(pasteText) || '')
                }
                editor.cmd.do('insertHTML', `<p>${pasteText}</p>`)
                return
            }

            // 先放开注释，有问题再追查 ————
            // // 表格中忽略，可能会出现异常问题
            // if (nodeName === 'TD' || nodeName === 'TH') {
            //     return
            // }

            if (!pasteHtml) {
                // 没有内容，可继续执行下面的图片粘贴
                resetTime()
                return
            }
            try {
                // firefox 中，获取的 pasteHtml 可能是没有 <ul> 包裹的 <li>
                // 因此执行 insertHTML 会报错
                if (pasteTextHandle && isFunction(pasteTextHandle)) {
                    // 用户自定义过滤处理粘贴内容
                    pasteHtml = '' + (pasteTextHandle(pasteHtml) || '')
                }
                editor.cmd.do('insertHTML', pasteHtml)
            } catch (ex) {
                // 此时使用 pasteText 来兼容一下
                if (pasteTextHandle && isFunction(pasteTextHandle)) {
                    // 用户自定义过滤处理粘贴内容
                    pasteText = '' + (pasteTextHandle(pasteText) || '')
                }
                editor.cmd.do('insertHTML', `<p>${pasteText}</p>`)
            }
        })

        // 粘贴图片
        $textElem.on('paste', e => {
            if (UA.isIE()) {
                return
            } else {
                e.preventDefault()
            }

            // 粘贴图片和文本，只能同时使用一个
            if (!canDo()) {
                return
            }

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

        // 为图片增加 selected 样式
        $textElem.on('click', 'img', function (e) {
            const img = this
            const $img = $(img)

            if ($img.attr('data-w-e') === '1') {
                // 是表情图片，忽略
                return
            }

            // 记录当前点击过的图片
            editor._selectedImg = $img

            // 修改选区并 restore ，防止用户此时点击退格键，会删除其他内容
            editor.selection.createRangeByElem($img)
            editor.selection.restoreSelection()
        })

        // 去掉图片的 selected 样式
        $textElem.on('click  keyup', e => {
            if (e.target.matches('img')) {
                // 点击的是图片，忽略
                return
            }
            // 删除记录
            editor._selectedImg = null
        })
    },

    // 拖拽事件
    _dragHandle: function () {
        const editor = this.editor

        // 禁用 document 拖拽事件
        const $document = $(document)
        $document.on('dragleave drop dragenter dragover', function (e) {
            e.preventDefault()
        })

        // 添加编辑区域拖拽事件
        const $textElem = editor.$textElem
        $textElem.on('drop', function (e) {
            e.preventDefault()
            const files = e.dataTransfer && e.dataTransfer.files
            if (!files || !files.length) {
                return
            }

            // 上传图片
            const uploadImg = editor.uploadImg
            uploadImg.uploadImg(files)
        })
    }
}

export default Text