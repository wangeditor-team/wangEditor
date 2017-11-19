/*
    menu - BackColor
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function BackColor(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paint-brush"><i/></div>')
    this.type = 'droplist'

    // 获取配置的颜色
    const config = editor.config
    const colors = config.colors || []

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 120,
        $title: $('<p>背景色</p>'),
        type: 'inline-block', // droplist 内容以 block 形式展示
        list: colors.map(color => {
            return { $elem: $(`<i style="color:${color};" class="w-e-icon-paint-brush"></i>`), value: color }
        }),
        onClick: (value) => {
            // 注意 this 是指向当前的 BackColor 对象
            this._command(value)
        }
    })
}

// 原型
BackColor.prototype = {
    constructor: BackColor,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.cmd.do('backColor', value)
    }
}

export default BackColor