/**
 * @description 增加缩进/减少缩进
 * @author tonghan
 */

import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import DropListMenu from '../menu-constructors/DropListMenu'
import { MenuActive } from '../menu-constructors/Menu'
import getParagraphs from './get-paragraphs'
import operateElement from './operate-element'

class Indent extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-indent-increase"></i>
            </div>`
        )
        const dropListConf = {
            width: 100,
            title: '设置缩进',
            type: 'list',
            list: [
                {
                    $elem: $(`<p><i class="w-e-icon-indent-increase"></i>增加缩进<p>`),
                    value: 'increase',
                },

                {
                    $elem: $(`<p><i class="w-e-icon-indent-decrease"></i>减少缩进<p>`),
                    value: 'decrease',
                },
            ],
            clickHandler: (value: string) => {
                // 注意 this 是指向当前的 Indent 对象
                this.command(value)
            },
        }

        super($elem, editor, dropListConf)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const $selectionElem = editor.selection.getSelectionContainerElem()

        // 判断 当前选区为 textElem 时
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            // 当 当前选区 等于 textElem 时
            // 代表 当前选区 可能是一个选择了一个完整的段落或者多个段落
            const $elems = getParagraphs(editor)
            if ($elems.length > 0) {
                $elems.forEach(item => {
                    operateElement($(item), value, editor)
                })
            }
        } else {
            // 当 当前选区 不等于 textElem 时
            // 代表 当前选区要么是一个段落，要么是段落中的一部分
            if ($selectionElem && $selectionElem.length > 0) {
                $selectionElem.forEach((item: any) => {
                    operateElement($(item), value, editor)
                })
            }
        }
    }

    /**
     * 尝试改变菜单激活（高亮）状态
     */
    public tryChangeActive() {}
}

export default Indent
