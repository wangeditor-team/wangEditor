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
        const $selectionElem = editor.selection.getSelectionContainerElem()

        // 选区范围的 DOM 元素不存在，不执行命令
        if ($selectionElem === undefined) return

        this.getSelectionRangeNodes()

        // 获取选区范围内的顶级 DOM 元素
        const $nodes = editor.selection.getSelectionRangeTopNodes()

        this.operateElements($nodes, type)

        // 是否激活
        this.tryChangeActive()
    }

    private getSelectionRangeNodes() {
        /**
         * 开始是 ul 的时候，因为 getNodeTop 的原因会直接拿到 ul 并且获取下一个兄弟节点导致 ul 有 point
         * 结束是 ul 的时候，因为 getNodeTop 的原因，上一个兄弟节点会直接拿到 ul 并且和 $endElem 匹配所以没有 point
         *
         * 所以我需要一个小方法对 ul ol 进行特殊处理
         */

        const editor = this.editor
        const $selectionElem = editor.selection.getSelectionContainerElem()
        const $startElem = (editor.selection.getSelectionStartElem() as DomElement).getNodeTop(
            editor
        )
        const $endElem = (editor.selection.getSelectionEndElem() as DomElement).getNodeTop(editor)

        const $nodes = editor.selection.getSelectionRangeTopNodes()

        if (this.isListElem($selectionElem as DomElement)) {
            // 当容器为 UL OL 的时候，选区必定是在 序列 中多选或者全选
        } else if (this.isListElem($startElem as DomElement)) {
            // 当开始的时候为 序列
            $nodes.shift()
            const $start = $startElem.prior
            const domArr: DomElement[] = []
            let $dom: Element | undefined | null = $start?.elems[0]
            while ($dom) {
                domArr.push($($dom).getNodeTop(editor))
                $dom = $dom.nextElementSibling
            }
            $nodes.unshift(...domArr)
        } else if (this.isListElem($endElem as DomElement)) {
            // 当结束的时候为 序列
            $nodes.pop()
            const $end = $endElem.prior
            const domArr: DomElement[] = []
            let $dom: Element | undefined | null = $end?.elems[0]
            while ($dom) {
                domArr.unshift($($dom).getNodeTop(editor))
                $dom = $dom.previousElementSibling
            }
            $nodes.push(...domArr)
        } else {
            // 当选区不是序列内且开头和结尾不是序列的时候，直接获取所有顶级段落即可
            return $nodes
        }
    }

    // 操作元素
    private operateElements($nodes: DomElement[], type: ListTypeValue) {
        // 获取 序列标签
        const listTarget = type.toLowerCase()

        return console.log($nodes)

        // 筛选
        const $listHtml: DomElement[] = []
        $nodes.forEach(($node: DomElement) => {
            const targerName = $node.getNodeName()
            if (targerName !== ListType.OrderedList && targerName !== ListType.UnorderedList) {
                $listHtml.push($node)
            } else {
                if ($node.prior) {
                    $listHtml.push($node.prior)
                } else {
                    const $children = $node.children()
                    $children?.forEach(($li: HTMLElement) => {
                        $listHtml.push($($li))
                    })
                }
            }
        })

        const $list = document.createElement(listTarget)
        $listHtml.forEach($node => {
            const targerName = $node.getNodeName()
            if (targerName === 'LI') {
                $list.append($node.elems[0])
            } else {
                const $li = document.createElement('li')
                $li.append($node.html())
                $list.append($li)
            }
        })

        // 删除这里有 bug
        const _range = this.editor.selection.getRange()
        _range?.deleteContents()
        _range?.insertNode($list)

        this.updateRange($($list))

        // if ($notLiHtml.length) {
        //     // 处理 多段落带非序列标签
        //     // const $docFragment = document.createDocumentFragment()
        //     $notLiHtml.forEach(($node: DomElement, index: number) => {
        //         const $list = $(
        //             `<${listHtml} data-list-level="1">
        //                 <li>${$node.html()}</li>
        //             </${listHtml}>`
        //         )
        //         $list.insertAfter($node)
        //         $node.remove()
        //         this.updateRange($list)
        //     })
        // } else {
        //     // 处理 序列标签
        //     $nodes.forEach(($node: DomElement, index: number) => {
        //         if ($node.getNodeName() === type) {
        //             const $li = $node.children()
        //             const $p = $(`<p>${$li?.html()}</p>`)
        //             $p.insertAfter($node)
        //             $node.remove()
        //             this.updateRange($p)
        //         } else {
        //             const $list = $(
        //                 `<${listHtml} data-list-level="${$node.attr('data-list-level')}">
        //                     ${$node.html()}
        //                 </${listHtml}>`
        //             )
        //             $list.insertAfter($node)
        //             $node.remove()
        //             this.updateRange($list)
        //         }
        //     })
        // }

        // 重置 序列属性
        // this.resetListAttr()
    }

    /**
     * 获取编辑区域的所有顶级段落，并对其中的序列进行处理
     */
    // private resetListAttr() {
    //     const editor = this.editor
    //     const $nodes = editor.$textElem.children() as DomElement
    //     let i = 1
    //     $nodes.forEach(($node: HTMLElement) => {
    //         const _$node = $($node)
    //         const $child = _$node.children() as DomElement
    //         const nodeName = _$node.getNodeName()

    //         if (nodeName === ListType.OrderedList) {
    //             _$node.attr('start', i.toString())
    //             i += $child.length
    //         } else {
    //             i = 1
    //         }
    //     })
    // }

    /**
     * 更新选区
     * @param $node
     */
    private updateRange($node: DomElement) {
        this.editor.selection.createRangeByElem($node, false, true)
        this.editor.selection.restoreSelection()
    }

    private isListElem($node: DomElement) {
        const nodeName = $node.getNodeName()
        if (nodeName === ListType.OrderedList || nodeName === ListType.UnorderedList) {
            return true
        }

        return false
    }

    public tryChangeActive(): void {}
}

export default List
