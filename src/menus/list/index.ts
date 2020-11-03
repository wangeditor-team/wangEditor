/**
 * @description 无序列表/有序列表
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import DropListMenu from '../menu-constructors/DropListMenu'
import { MenuActive } from '../menu-constructors/Menu'

/**
 * 列表的种类
 */
export enum ListType {
    OrderedList = 'OL',
    UnorderedList = 'UL',
}

// 序列类型
type ListTypeValue = ListType

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
                    value: ListType.UnorderedList,
                },

                {
                    $elem: $(
                        `<p>
                            <i class="w-e-icon-list-numbered w-e-drop-list-item"></i>
                            ${editor.i18next.t('menus.dropListMenu.list.有序列表')}
                        <p>`
                    ),
                    value: ListType.OrderedList,
                },
            ],
            clickHandler: (value: string) => {
                // 注意 this 是指向当前的 List 对象
                this.command(value as ListTypeValue)
            },
        }

        super($elem, editor, dropListConf)
    }

    public command(type: ListTypeValue): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        const $selectionElem = editor.selection.getSelectionContainerElem()

        // 选区范围的 DOM 元素不存在，不执行命令
        if ($selectionElem === undefined) return

        // 获取选区范围内的顶级 DOM 元素
        const $nodes = editor.selection.getSelectionRangeTopNodes()

        this.operateElements($nodes, type)

        // 恢复选区
        editor.selection.restoreSelection()
        this.tryChangeActive()
    }

    public tryChangeActive(): void {}

    // 操作元素
    private operateElements($nodes: DomElement[], type: ListTypeValue) {
        /**
         * 列表的每一项都是独立的通过 type 决定 list-style 的样式
         * 有序列表通过 start 决定起始值
         * 列表的层级通过 data-list-level 来决定 但是这样就需要用户配置 css 那么属性要加 style 也要加
         *
         * 多段落的时候 优先处理 非序列段落，只有序列段落的时候 进行取消操作
         *
         **/

        const listHtml = type.toLowerCase()

        const $notLiHtml = $nodes.filter(($node: DomElement) => {
            const targerName = $node.getNodeName()
            if (targerName !== 'UL' && targerName !== 'OL') {
                return $node
            }
        })

        if ($notLiHtml.length) {
            // const $docFragment = document.createDocumentFragment()
            $notLiHtml.forEach(($node: DomElement, index: number) => {
                const $list = $(
                    `<${listHtml} data-list-level="1"><li>${$node.html()}</li></${listHtml}>`
                )
                $list.insertAfter($node)
                $node.remove()
                this.updateRange($list)
            })
        }
    }

    /**
     * 更新选区
     * @param $node
     */
    private updateRange($node: DomElement) {
        this.editor.selection.createRangeByElem($node, false, true)
    }
}

export default List
