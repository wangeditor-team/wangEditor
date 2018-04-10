/*
    menu - fontName
*/

import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function FontName(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-font"></i></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 获取配置的字体
    const config = editor.config
    const fontNames = config.fontNames || []

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>字体</p>'),
        type: 'list', // droplist 以列表形式展示
        list: fontNames.map(fontName => {
            return { $elem: $(`<span style="font-family: ${fontName};">${fontName}</span>`), value: fontName }
        }),
        onClick: (value) => {
            // 注意 this 是指向当前的 FontName 对象
            this._command(value)
        }
    })
}

// 原型
FontName.prototype = {
    constructor: FontName,

    _command: function (value) {
        const editor = this.editor
        editor.cmd.do('fontName', value)
    }
}

export default FontName