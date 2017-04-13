/*
    menu - forecolor
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function ForeColor(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paint-brush"><i/></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>背景色</p>'),
        list: [
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#ffffff;"></span></li>'), value: '#ffffff' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#000000;"></span></li>'), value: '#000000' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#eeece0;"></span></li>'), value: '#eeece0' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#1c487f;"></span></li>'), value: '#1c487f' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#4d80bf;"></span></li>'), value: '#4d80bf' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#c24f4a;"></span></li>'), value: '#c24f4a' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#8baa4a;"></span></li>'), value: '#8baa4a' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#7b5ba1;"></span></li>'), value: '#7b5ba1' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#46acc8;"></span></li>'), value: '#46acc8' },
            { $elem: $('<li><span class="w-e-inline-block" style="background-color:#f9963b;"></span></li>'), value: '#f9963b' }
        ],
        onClick: (value) => {
            // 注意 this 是指向当前的 ForeColor 对象
            this._command(value)
        }
    })
}

// 原型
ForeColor.prototype = {
    constructor: ForeColor,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.cmd.do('backColor', value)
    }
}

export default ForeColor