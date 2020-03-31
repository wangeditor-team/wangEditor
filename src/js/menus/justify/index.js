/*
    menu - justify
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function Justify(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paragraph-left"></i></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>对齐方式</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<span><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFCNDE5NTYyNzJGNDExRUE5ODg3ODQwRjlDNENGMDdCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFCNDE5NTYzNzJGNDExRUE5ODg3ODQwRjlDNENGMDdCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUI0MTk1NjA3MkY0MTFFQTk4ODc4NDBGOUM0Q0YwN0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUI0MTk1NjE3MkY0MTFFQTk4ODc4NDBGOUM0Q0YwN0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5EVW6UAAAAOklEQVR42mI0Njb+z0ACYAHiClI1zCJVw11SNSiTquEdqRpMSNVwhlQNQqRqECSg5h6pwcqIzAEIMAAxOAehDdQ8EwAAAABJRU5ErkJggg==" /> 两端对齐</span>'), value: 'justifyFull' }, 
            { $elem: $('<span><i class="w-e-icon-paragraph-left"></i> 靠左对齐</span>'), value: 'justifyLeft' }, 
            { $elem: $('<span><i class="w-e-icon-paragraph-center"></i> 居中对齐</span>'), value: 'justifyCenter' }, 
            { $elem: $('<span><i class="w-e-icon-paragraph-right"></i> 靠右对齐</span>'), value: 'justifyRight' }
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