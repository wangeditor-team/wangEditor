/**
 * @description 无序列表/有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import DropListMenu from '../menu-constructors/DropListMenu'
import { MenuActive } from '../menu-constructors/Menu'

class List extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-list2"></i>
            </div>`
        )

        const dropListConf = {
            width: 130,
            title: '序列',
            type: 'list',
            list: [
                {
                    $elem: $(`
                        <p>
                            <i class="w-e-icon-list2 w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.list.无序列表')}
                        <p>`),
                    value: 'insertUnorderedList',
                },

                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-list-numbered w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.list.有序列表')}
                        <p>`
                    ),
                    value: 'insertOrderedList',
                },
            ],
            clickHandler: (value: string) => {
                // 注意 this 是指向当前的 List 对象
                this.command(value)
            },
        }

        super($elem, editor, dropListConf)
    }

    public command(value: string): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        const $selectionElem = editor.selection.getSelectionContainerElem()

        // 选区范围的 DOM 元素不存在，不执行命令
        if ($selectionElem === undefined) return

        if ($textElem.equal($selectionElem)) {
            // 选区范围的 DOM 元素等于 textElem 时
            // 代表当前选区可能是一个段落或者多个段落
            const $nodes = editor.selection.getSelectionRangeTopNodes()
        } else {
            // 选区范围的 DOM 元素不等于 textElem 时
            // 代表 当前选区要么是一个段落，要么是段落中的一部分
            const $node = $selectionElem.first()
        }

        // 恢复选区
        editor.selection.restoreSelection()
        this.tryChangeActive()
    }

    public tryChangeActive(): void {}
}

export default List
