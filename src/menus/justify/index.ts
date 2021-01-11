/**
 * @description 对齐方式
 * @author liuwei
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'

class Justify extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            '<div class="w-e-menu" data-title="对齐"><i class="w-e-icon-paragraph-left"></i></div>'
        )

        const dropListConf = {
            width: 100,
            title: '对齐方式',
            type: 'list', // droplist 以列表形式展示
            list: [
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-left w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.靠左')}
                        </p>`
                    ),
                    value: 'left',
                },
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-center w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.居中')}
                        </p>`
                    ),
                    value: 'center',
                },
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-right w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.靠右')}
                        </p>`
                    ),
                    value: 'right',
                },
                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-paragraph-justify w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.justify.两端')}
                        </p>`
                    ),
                    value: 'justify',
                },
            ],
            clickHandler: (value: string) => {
                // 执行对应的value操作
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
        const selection = editor.selection
        const $selectionElem = selection.getSelectionContainerElem()

        // 保存选区
        selection.saveRange()

        // 获取顶级元素
        const $elems = editor.selection.getSelectionRangeTopNodes(editor)
        if ($selectionElem?.length) {
            // list 在chrome下默认多包裹一个 p，导致不能通过顶层元素判断，所以单独加个判断
            if (this.isSpecialNode($selectionElem) || this.isSpecialTopNode($elems[0])) {
                $selectionElem.css('text-align', value)
            } else {
                $elems.forEach((el: DomElement) => {
                    el.css('text-align', value)
                })
            }
        }
        //恢复选区
        selection.restoreSelection()
    }

    /**
     * 当选区元素是某些特殊元素时，只需要修改子元素的对齐样式的元素
     * @param el DomElement
     */
    private isSpecialNode(el: DomElement) {
        const selectionNode = el.elems[0]
        // 如果以后有类似的元素要这样处理，直接修改这个数组即可
        const specialNodeLists = ['LI']
        return specialNodeLists.indexOf(selectionNode?.nodeName) !== -1
    }

    /**
     * 当选区 top 元素为某些特殊元素时，只需要修改子元素的对齐样式的元素
     * @param el DomElement
     */
    private isSpecialTopNode(topEl: DomElement) {
        const selectionNode = topEl.elems[0]
        // 如果以后有类似的元素要这样处理，直接修改这个数组即可
        const specialNodeLists = ['BLOCKQUOTE', 'UL']
        return specialNodeLists.indexOf(selectionNode?.nodeName) !== -1
    }

    /**
     * 尝试改变菜单激活（高亮）状态
     * 默认左对齐,若选择其他对其方式对active进行高亮否则unActive
     * ?考虑优化的话 是否可以对具体选中的进行高亮
     */
    public tryChangeActive(): void {}
}

export default Justify
