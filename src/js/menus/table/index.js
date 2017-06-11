/*
    menu - table
*/
import $ from '../../util/dom-core.js'
import { getRandom } from '../../util/util.js'
import Panel from '../panel.js'

// 构造函数
function Table(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-table2"><i/></div>')
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Table.prototype = {
    constructor: Table,

    onClick: function () {
        if (this._active) {
            // 编辑现有表格
            this._createEditPanel()
        } else {
            // 插入新表格
            this._createInsertPanel()
        }
    },

    // 创建插入新表格的 panel
    _createInsertPanel: function () {
        // 用到的 id
        const btnInsertId = getRandom('btn')
        const textRowNum = getRandom('row')
        const textColNum = getRandom('col')

        const panel = new Panel(this, {
            width: 250,
            // panel 包含多个 tab
            tabs: [
                {
                    // 标题
                    title: '插入表格',
                    // 模板
                    tpl: `<div>
                        <p style="text-align:left; padding:5px 0;">
                            创建
                            <input id="${textRowNum}" type="text" value="5" style="width:40px;text-align:center;"/>
                            行
                            <input id="${textColNum}" type="text" value="5" style="width:40px;text-align:center;"/>
                            列的表格
                        </p>
                        <div class="w-e-button-container">
                            <button id="${btnInsertId}" class="right">插入</button>
                        </div>
                    </div>`,
                    // 事件绑定
                    events: [
                        {
                            // 点击按钮，插入表格
                            selector: '#' + btnInsertId,
                            type: 'click',
                            fn: () => {
                                const rowNum = parseInt($('#' + textRowNum).val())
                                const colNum = parseInt($('#' + textColNum).val())

                                if (rowNum && colNum && rowNum > 0 && colNum > 0) {
                                    // form 数据有效
                                    this._insert(rowNum, colNum)
                                }

                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        }
                    ]
                } // first tab end
            ]  // tabs end
        }) // panel end

        // 展示 panel
        panel.show()

        // 记录属性
        this.panel = panel
    },

    // 插入表格
    _insert: function (rowNum, colNum) {
        // 拼接 table 模板
        let r, c
        let html = '<table border="0" width="100%" cellpadding="0" cellspacing="0">'
        for (r = 0; r < rowNum; r++) {
            html += '<tr>'
            if (r === 0) {
                for (c = 0; c < colNum; c++) {
                    html += '<th>&nbsp;</th>'
                }
            } else {
                for (c = 0; c < colNum; c++) {
                    html += '<td>&nbsp;</td>'
                }
            }
            html += '</tr>'
        }
        html += '</table><p><br></p>'

        // 执行命令
        const editor = this.editor
        editor.cmd.do('insertHTML', html)

        // 防止 firefox 下出现 resize 的控制点
        editor.cmd.do('enableObjectResizing', false)
        editor.cmd.do('enableInlineTableEditing', false)
    },

    // 创建编辑表格的 panel
    _createEditPanel: function () {
        // 可用的 id
        const addRowBtnId = getRandom('add-row')
        const addColBtnId = getRandom('add-col')
        const delRowBtnId = getRandom('del-row')
        const delColBtnId = getRandom('del-col')
        const delTableBtnId = getRandom('del-table')

        // 创建 panel 对象
        const panel = new Panel(this, {
            width: 320,
            // panel 包含多个 tab
            tabs: [
                {
                    // 标题
                    title: '编辑表格',
                    // 模板
                    tpl: `<div>
                        <div class="w-e-button-container" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;margin-bottom:5px;">
                            <button id="${addRowBtnId}" class="left">增加行</button>
                            <button id="${delRowBtnId}" class="red left">删除行</button>
                            <button id="${addColBtnId}" class="left">增加列</button>
                            <button id="${delColBtnId}" class="red left">删除列</button>
                        </div>
                        <div class="w-e-button-container">
                            <button id="${delTableBtnId}" class="gray left">删除表格</button>
                        </dv>
                    </div>`,
                    // 事件绑定
                    events: [
                        {
                            // 增加行
                            selector: '#' + addRowBtnId,
                            type: 'click',
                            fn: () => {
                                this._addRow()
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        },
                        {
                            // 增加列
                            selector: '#' + addColBtnId,
                            type: 'click',
                            fn: () => {
                                this._addCol()
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        },
                        {
                            // 删除行
                            selector: '#' + delRowBtnId,
                            type: 'click',
                            fn: () => {
                                this._delRow()
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        },
                        {
                            // 删除列
                            selector: '#' + delColBtnId,
                            type: 'click',
                            fn: () => {
                                this._delCol()
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        },
                        {
                            // 删除表格
                            selector: '#' + delTableBtnId,
                            type: 'click',
                            fn: () => {
                                this._delTable()
                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        }
                    ]
                }
            ]
        })
        // 显示 panel
        panel.show()
    },

    // 获取选中的单元格的位置信息
    _getLocationData: function () {
        const result = {}
        const editor = this.editor
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        const nodeName = $selectionELem.getNodeName()
        if (nodeName !== 'TD' && nodeName !== 'TH') {
            return
        }

        // 获取 td index
        const $tr = $selectionELem.parent()
        const $tds = $tr.children()
        const tdLength = $tds.length
        $tds.forEach((td, index) => {
            if (td === $selectionELem[0]) {
                // 记录并跳出循环
                result.td = {
                    index: index,
                    elem: td,
                    length: tdLength
                }
                return false
            }
        })

        // 获取 tr index
        const $tbody = $tr.parent()
        const $trs = $tbody.children()
        const trLength = $trs.length
        $trs.forEach((tr, index) => {
            if (tr === $tr[0]) {
                // 记录并跳出循环
                result.tr = {
                    index: index,
                    elem: tr,
                    length: trLength
                }
                return false
            }
        })

        // 返回结果
        return result
    },

    // 增加行
    _addRow: function () {
        // 获取当前单元格的位置信息
        const locationData = this._getLocationData()
        if (!locationData) {
            return
        }
        const trData = locationData.tr
        const $currentTr = $(trData.elem)
        const tdData = locationData.td
        const tdLength = tdData.length

        // 拼接即将插入的字符串
        const newTr = document.createElement('tr')
        let tpl = '', i
        for (i = 0; i < tdLength; i++) {
            tpl += '<td>&nbsp;</td>'
        }
        newTr.innerHTML = tpl
        // 插入
        $(newTr).insertAfter($currentTr)
    },

    // 增加列
    _addCol: function () {
        // 获取当前单元格的位置信息
        const locationData = this._getLocationData()
        if (!locationData) {
            return
        }
        const trData = locationData.tr
        const tdData = locationData.td
        const tdIndex = tdData.index
        const $currentTr = $(trData.elem)
        const $trParent = $currentTr.parent()
        const $trs = $trParent.children()

        // 遍历所有行
        $trs.forEach(tr => {
            const $tr = $(tr)
            const $tds = $tr.children()
            const $currentTd = $tds.get(tdIndex)
            const name = $currentTd.getNodeName().toLowerCase()

            // new 一个 td，并插入
            const newTd = document.createElement(name)
            $(newTd).insertAfter($currentTd)
        })
    },

    // 删除行
    _delRow: function () {
        // 获取当前单元格的位置信息
        const locationData = this._getLocationData()
        if (!locationData) {
            return
        }
        const trData = locationData.tr
        const $currentTr = $(trData.elem)
        $currentTr.remove()
    },

    // 删除列
    _delCol: function () {
        // 获取当前单元格的位置信息
        const locationData = this._getLocationData()
        if (!locationData) {
            return
        }
        const trData = locationData.tr
        const tdData = locationData.td
        const tdIndex = tdData.index
        const $currentTr = $(trData.elem)
        const $trParent = $currentTr.parent()
        const $trs = $trParent.children()

        // 遍历所有行
        $trs.forEach(tr => {
            const $tr = $(tr)
            const $tds = $tr.children()
            const $currentTd = $tds.get(tdIndex)
            // 删除
            $currentTd.remove()
        })
    },

    // 删除表格
    _delTable: function () {
        const editor = this.editor
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        const $table = $selectionELem.parentUntil('table')
        if (!$table) {
            return
        }
        $table.remove()
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        const nodeName = $selectionELem.getNodeName()
        if (nodeName === 'TD' || nodeName === 'TH') {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Table