/*
    menu - header
*/
import $ from '../util/dom-core.js'
import DropList from './droplist/index.js'

// 构造函数
function Head(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-header"><i/></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>设置标题</p>'),
        list: [
            { $elem: $('<li><h1>H1</h1></li>'), value: 'h1' },
            { $elem: $('<li><h2>H2</h2></li>'), value: 'h2' },
            { $elem: $('<li><h3>H3</h3></li>'), value: 'h3' },
            { $elem: $('<li><h4>H4</h4></li>'), value: 'h5' },
            { $elem: $('<li><h5>H5</h5></li>'), value: 'h6' },
            { $elem: $('<li><p>正文</p></li>'), value: 'p' }
        ],
        onClick: (value) => {
            // 注意 this 是指向当前的 Head 对象
            this._command(value)
        }
    })
}

// 原型
Head.prototype = {
    constructor: Head,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.cmd.do('formatBlock', value)
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        const reg = /^h/i
        const cmdValue = editor.cmd.queryCommandValue('formatBlock')
        if (reg.test(cmdValue)) {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Head