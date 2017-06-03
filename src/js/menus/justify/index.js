/*
    menu - justify
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function Justify(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paragraph-left"><i/></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>对齐方式</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<span><i class="w-e-icon-paragraph-left"></i> 靠左</span>'), value: 'justifyLeft' },
            { $elem: $('<span><i class="w-e-icon-paragraph-center"></i> 居中</span>'), value: 'justifyCenter' },
            { $elem: $('<span><i class="w-e-icon-paragraph-right"></i> 靠右</span>'), value: 'justifyRight' }
        ],
        onClick: (value) => {
            // 注意 this 是指向当前的 List 对象
            this._command(value)
        }
    })
}

// 原型
Justify.prototype = {
    constructor: Justify,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.cmd.do(value)
    }
}

export default Justify