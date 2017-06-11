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
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<span><i class="w-e-icon-list-numbered"></i> 有序列表</span>'), value: 'insertOrderedList' },
            { $elem: $('<span><i class="w-e-icon-list2"></i> 无序列表</span>'), value: 'insertUnorderedList' }
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
        const $textElem = editor.$textElem
        editor.selection.restoreSelection()
        if (editor.cmd.queryCommandState(value)) {
            return
        }
        editor.cmd.do(value)

        // 验证列表是否被包裹在 <p> 之内
        let $selectionElem = editor.selection.getSelectionContainerElem()
        if ($selectionElem.getNodeName() === 'LI') {
            $selectionElem = $selectionElem.parent()
        }
        if (/^ol|ul$/i.test($selectionElem.getNodeName()) === false) {
            return
        }
        if ($selectionElem.equal($textElem)) {
            // 证明是顶级标签，没有被 <p> 包裹
            return
        }
        const $parent = $selectionElem.parent()
        if ($parent.equal($textElem)) {
            // $parent 是顶级标签，不能删除
            return
        }

        $selectionElem.insertAfter($parent)
        $parent.remove()
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