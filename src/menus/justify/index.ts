/**
 * @description 对齐方式
 * @author liuwei
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'

class Justify extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-paragraph-left"></i></div>')
        const dropListConf = {
            width: 100,
            title: '对齐方式',
            type: 'list', // droplist 以列表形式展示
            list: [
                {
                    $elem: $(
                        '<span><i class="w-e-icon-paragraph-left" style="color:#999"></i>靠左 </span>'
                    ),
                    value: 'justifyLeft',
                },
                {
                    $elem: $(
                        '<span><i class="w-e-icon-paragraph-center" style="color:#999"></i> 居中 </span>'
                    ),
                    value: 'justifyCenter',
                },
                {
                    $elem: $(
                        '<span><i class="w-e-icon-paragraph-right" style="color:#999"></i> 靠右</span>'
                    ),
                    value: 'justifyRight',
                },
            ],
            clickHandler: (value: string) => {
                const editor = this.editor
                // 执行对应的value操作
                editor.cmd.do(value)
            },
        }
        super($elem, editor, dropListConf)
    }

    /**
     * 尝试改变菜单激活（高亮）状态
     * 默认左对齐,若选择其他对其方式对active进行高亮否则unActive
     * ?考虑优化的话 是否可以对具体选中的进行高亮
     */
    public tryChangeActive() {
        const editor = this.editor
        let isjustify = ['justifyCenter', 'justifyRight'].some(e => editor.cmd.queryCommandState(e))
        if (isjustify) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Justify
