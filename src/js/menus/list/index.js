/*
    menu - list
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function List(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-list2"><i/></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 120,
        $title: $('<p>设置列表</p>'),
        list: [
            { $elem: $('<li><b class="w-e-icon-list-numbered"></b> 有序列表</li>'), value: 'insertOrderedList' },
            { $elem: $('<li><b class="w-e-icon-list2"></b> 无序列表</li>'), value: 'insertUnorderedList' }
        ],
        onClick: (value) => {
            // 注意 this 是指向当前的 List 对象
            this._command(value)
        }
    })
}

// 原型
List.prototype = {
    constructor: List,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.selection.restoreSelection()
        if (editor.cmd.queryCommandState(value)) {
            return
        }
        editor.cmd.do(value)
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        if (editor.cmd.queryCommandState('insertUnOrderedList') || editor.cmd.queryCommandState('insertOrderedList')) {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default List