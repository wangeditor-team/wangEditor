/*
    menu - fontSize
*/

import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function FontSize(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-text-heigh"></i></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 160,
        $title: $('<p>字号</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<span style="font-size: x-small;">x-small</span>'), value: '1' },
            { $elem: $('<span style="font-size: small;">small</span>'), value: '2' },
            { $elem: $('<span>normal</span>'), value: '3' },
            { $elem: $('<span style="font-size: large;">large</span>'), value: '4' },
            { $elem: $('<span style="font-size: x-large;">x-large</span>'), value: '5' },
            { $elem: $('<span style="font-size: xx-large;">xx-large</span>'), value: '6' }
        ],
        onClick: (value) => {
            // 注意 this 是指向当前的 FontSize 对象
            this._command(value)
        }
    })
}

// 原型
FontSize.prototype = {
    constructor: FontSize,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.cmd.do('fontSize', value)
    }
}

export default FontSize