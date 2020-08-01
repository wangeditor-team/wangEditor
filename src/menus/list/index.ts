/**
 * @description 无序列表/有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import DropListMenu from '../menu-constructors/DropListMenu'
import { MenuActive } from '../menu-constructors/Menu'
import { getNodeTop, getSelectionRangeTopNodes } from '../../utils/util'
import operateElement from './operate-element'

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
                    $elem: $(`<p><i class="w-e-icon-list2 w-e-drop-list-item"></i>无序列表<p>`),
                    value: 'insertUnorderedList',
                },

                {
                    $elem: $(
                        `<p><i class="w-e-icon-list-numbered w-e-drop-list-item"></i>有序列表<p>`
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

        editor.cmd.do(value)

        // 验证列表是否被包裹在 <p> 之内
        let $selectionElem = $(editor.selection.getSelectionContainerElem())
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

        // const editor = this.editor
        // const $selectionElem = editor.selection.getSelectionContainerElem()

        // // 判断 当前选区为 textElem 时
        // if ($selectionElem && editor.$textElem.equal($selectionElem)) {
        //     // 当 当前选区 等于 textElem 时
        //     // 代表 当前选区 可能是一个选择了一个完整的段落或者多个段落
        //     const $elems = getSelectionRangeTopNodes(editor)
        //     if ($elems.length > 0) {
        //         $elems.forEach((item: DomElement) => {
        //             operateElement($(item), value, editor)
        //         })
        //     }
        // } else {
        //     // 当 当前选区 不等于 textElem 时
        //     // 代表 当前选区要么是一个段落，要么是段落中的一部分
        //     if ($selectionElem && $selectionElem.length > 0) {
        //         $selectionElem.forEach((item: DomElement) => {
        //             operateElement($(item), value, editor)
        //         })
        //     }
        // }

        // 恢复选区
        editor.selection.restoreSelection()
        this.tryChangeActive()
    }

    public tryChangeActive(): void {
        const editor = this.editor
        const $selectionElem = editor.selection.getSelectionStartElem()
        const $selectionStartElem = getNodeTop($($selectionElem), editor)
        const regUl = /^UL$/i
        const regOl = /^OL$/i

        if ($selectionStartElem.length <= 0) return

        if (
            regOl.test($selectionStartElem.getNodeName()) ||
            regUl.test($selectionStartElem.getNodeName())
        ) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default List
