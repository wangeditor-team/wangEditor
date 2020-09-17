/**
 * @description 无序列表/有序列表
 * @author tonghan
 */

import $ from '../../utils/dom-core'
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
        editor.selection.restoreSelection()

        // 判断是否已经执行了命令
        if (editor.cmd.queryCommandState(value)) {
            return
        }

        //禁止在table中添加列表
        let $selectionElem = $(editor.selection.getSelectionContainerElem())
        let $dom = $($selectionElem.elems[0]).parentUntil('TABLE', $selectionElem.elems[0])
        if ($dom && $($dom.elems[0]).getNodeName() === 'TABLE') {
            return
        }

        editor.cmd.do(value)

        // 验证列表是否被包裹在 <p> 之内
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

        // 恢复选区
        editor.selection.restoreSelection()
        this.tryChangeActive()
    }

    public tryChangeActive(): void {}
}

export default List
