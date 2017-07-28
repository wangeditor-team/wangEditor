/*
    menu - header
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

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
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<h1>H1</h1>'), value: '<h1>' },
            { $elem: $('<h2>H2</h2>'), value: '<h2>' },
            { $elem: $('<h3>H3</h3>'), value: '<h3>' },
            { $elem: $('<h4>H4</h4>'), value: '<h4>' },
            { $elem: $('<h5>H5</h5>'), value: '<h5>' },
            { $elem: $('<p>正文</p>'), value: '<p>' }
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

        const $selectionElem = editor.selection.getSelectionContainerElem()
        if (editor.$textElem.equal($selectionElem)) {
            // 不能选中多行来设置标题，否则会出现问题
            // 例如选中的是 <p>xxx</p><p>yyy</p> 来设置标题，设置之后会成为 <h1>xxx<br>yyy</h1> 不符合预期
            return
        }

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