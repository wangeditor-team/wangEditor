/*
    menu - img
*/
import $ from '../../util/dom-core.js'
import { getRandom } from '../../util/util.js'
import Panel from '../panel.js'

// 构造函数
function Image(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-image"><i/></div>')
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Image.prototype = {
    constructor: Image,

    onClick: function () {
        this._createPanel()
    },

    _createPanel: function () {
        const panel = new Panel(this, {
            width: 300,
            tabs: [
                {
                    title: '上传图片',
                    tpl: `<div>待开发...</div>`,
                    events: [
                    ]
                },
                {
                    title: '网络图片',
                    tpl: `<div>待开发...</div>`,
                    events: [
                    ]
                }
            ]
        })

        // 展示
        panel.show()

        // 记录属性
        this.panel = panel
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        // const editor = this.editor
        // const $elem = this.$elem
        // const $selectionELem = editor.selection.getSelectionContainerElem()
        // const nodeName = $selectionELem.getNodeName()
        // if (nodeName === 'TD' || nodeName === 'TH') {
        //     this._active = true
        //     $elem.addClass('w-e-active')
        // } else {
        //     this._active = false
        //     $elem.removeClass('w-e-active')
        // }
    }
}

export default Image