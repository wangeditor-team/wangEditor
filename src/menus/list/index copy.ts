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

        // 获取选区范围内的顶级 DOM 元素
        this.handleSelectionRangeNodes(type)

        // 是否激活
        this.tryChangeActive()
    }

    private handleSelectionRangeNodes(type: ListTypeValue): void {
        // 获取 序列标签
        const orderTarget = type.toLowerCase()

        const editor = this.editor
        let $selectionElem = editor.selection.getSelectionContainerElem() as DomElement
        const $startElem = (editor.selection.getSelectionStartElem() as DomElement).getNodeTop(editor)
        const $endElem = (editor.selection.getSelectionEndElem() as DomElement).getNodeTop(editor)
        const $nodes = editor.selection.getSelectionRangeTopNodes()
        const _range = this.editor.selection.getRange()

        // 防止光标的时候判断异常
        if(!editor.$textElem.equal($selectionElem)) {
            $selectionElem = $selectionElem.getNodeTop(editor)
        }

        if (this.isListElem($selectionElem as DomElement)) {
            // 当容器为 UL OL 的时候，选区必定是在 序列 中多选或者全选
            $nodes.length = 0 // 清空
            const containerNodeName = $selectionElem?.getNodeName()
            
            const $start = $startElem.prior
            const $end = $endElem.prior

            if(
                !$startElem.prior &&
                !$endElem.prior ||
                !$start?.elems[0].previousElementSibling &&
                !$end?.elems[0].nextElementSibling
            ) {
                // 全选序列的情况
                ($selectionElem?.children() as DomElement).forEach(($node: HTMLElement) => {
                    $nodes.push($($node))
                })
                const $selectionNodes = this.filterSelectionNodes($nodes)
                if(containerNodeName === type) {
                    // 取消
                    const $docFragment = document.createDocumentFragment()
                    $selectionNodes.forEach($node => {
                        const $list = document.createElement('p')
                        $list.innerHTML = $node.html()
                        $docFragment.append($list)
                        $node.remove()
                    })
                    $($docFragment).insertAfter($selectionElem)
                    $selectionElem.remove()
                } else {
                    // 转变
                    const $docFragment = document.createElement(orderTarget)
                    $selectionNodes.forEach($node => {
                        $docFragment.append($node.elems[0])
                    })
                    $($docFragment).insertAfter($selectionElem)
                    $selectionElem.remove()
                }
            } else {
                // 非全选序列的情况
                let $selectDom: Element | undefined | null = $start?.elems[0]

                // 获取选中的内容
                while ($selectDom) {
                    $nodes.push($($selectDom))
                    if($end?.equal($($selectDom))) {
                        // 判断是否结束了
                        $selectDom = null
                    } else {
                        $selectDom = $selectDom.nextElementSibling
                    }
                }

                const $prveDom: Element | undefined | null = $start?.elems[0].previousElementSibling
                let $nextDom: Element | undefined | null = $end?.elems[0].nextElementSibling

                // 选择的代码片段生成
                let $docFragment: HTMLElement | DocumentFragment = containerNodeName === type 
                    ? document.createDocumentFragment() 
                    : document.createElement(orderTarget)
                const $selectionNodes = this.filterSelectionNodes($nodes)
                $selectionNodes.forEach(($node: DomElement) => {
                    let $dom: HTMLElement 
                    if(containerNodeName === type) {
                        $dom = document.createElement('p')
                        $dom.innerHTML = $node.html()
                        $node.remove()
                    } else {
                        $dom = $node.elems[0]
                    }
                    $docFragment.append($dom)
                })

                
                if($prveDom && $nextDom) {
                    // 当选区在序列中间的时候 需要处理尾部内容
                    const $tailDomArr: DomElement[] = []
                    while ($nextDom) {
                        $tailDomArr.push($($nextDom))
                        if($end?.equal($($nextDom))) {
                            // 判断是否结束了
                            $nextDom = null
                        } else {
                            $nextDom = $nextDom.nextElementSibling
                        }
                    }
                    const $tailDocFragment = document.createElement(containerNodeName)
                    $tailDomArr.forEach(($node: DomElement) => {
                        $tailDocFragment.append($node.elems[0])
                    })
                    $($tailDocFragment).insertAfter($selectionElem)
                    $selectionElem.parent().elems[0].insertBefore($docFragment, $selectionElem.elems[0].nextElementSibling)
                } else if(!$prveDom) {
                    // 上半部分
                    $($docFragment).insertBefore($selectionElem)
                } else if(!$nextDom) {
                    // 下半部分
                    $($docFragment).insertAfter($selectionElem)
                }
            }
        } else if(this.isListElem($startElem as DomElement) && this.isListElem($endElem as DomElement)) {
            // 开头和结尾都是序列的时候
            
        } else if (this.isListElem($startElem as DomElement)) {
            // 当开始的时候为 序列
            $nodes.shift()
            const startNodeName = $startElem?.getNodeName()

            if(startNodeName === type) {
                // 当前序列类型和选区开头序列的类型一致
                const $docFragment = document.createDocumentFragment()
                const $selectionNodes = this.filterSelectionNodes($nodes)
                $selectionNodes.forEach($node => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $docFragment.append($list)
                    $node.remove()
                })

                $startElem.elems[0].append($docFragment)
            } else {
                // 当前序列类型和选区开头序列的类型不一致
                const $docFragment = document.createElement(orderTarget)

                let $dom: Element | undefined | null | void
                if($startElem.prior) {
                    // 有 prior 代表不是全选序列
                    $dom = $startElem.prior.elems[0]
                } else {
                    // 没有则代表全选序列
                    $dom = $startElem.children()?.elems[0]
                }

                while ($dom) {
                    $dom = [$dom.nextElementSibling, $docFragment.append($dom)][0]
                }

                const $selectionNodes = this.filterSelectionNodes($nodes)
                $selectionNodes.forEach(($node: DomElement) => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $docFragment.append($list)
                    $node.remove()
                })
                $($docFragment).insertAfter($startElem)
                if($startElem.children()?.length === 0) {
                    $startElem.remove()
                }
            }

        } else if (this.isListElem($endElem as DomElement)) {
            // 当结束的时候为 序列
            $nodes.pop()
            const endNodeName = $endElem?.getNodeName()

            if(endNodeName === type) {
                // 当前序列类型和选区结束序列的类型一致
                const $docFragment = document.createDocumentFragment()
                const $selectionNodes = this.filterSelectionNodes($nodes)

                $selectionNodes.forEach(($node: DomElement) => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $docFragment.append($list)
                    $node.remove()
                })

                $endElem.elems[0].insertBefore($docFragment, $endElem.children()?.elems[0] as HTMLElement)
            } else {
                // 当前序列类型和选区结束序列的类型不一致
                const $docFragment = document.createElement(orderTarget)
                const $selectionNodes = this.filterSelectionNodes($nodes)
                const $end = $endElem.prior
                const domArr: DomElement[] = []
                let $dom: Element | undefined | null = $end?.elems[0]

                while ($dom) {
                    domArr.unshift($($dom))
                    $dom = $dom.previousElementSibling
                }

                $selectionNodes.push(...domArr)
                $selectionNodes.forEach(($node: DomElement) => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $docFragment.append($list)
                    $node.remove()
                })

                $($docFragment).insertBefore($endElem)
                if($endElem.children()?.length === 0) {
                    $endElem.remove()
                }
            }
        } else {
            // 当选区不是序列内且开头和结尾不是序列的时候，直接获取所有顶级段落即可
            const $docFragment = document.createElement(orderTarget)
            const $selectionNodes = this.filterSelectionNodes($nodes)
            $selectionNodes.forEach(($node: DomElement) => {
                const $list = document.createElement('li')
                $list.innerHTML = $node.html()
                $docFragment.append($list)
                $node.remove()
            })

            _range?.deleteContents()
            _range?.insertNode($docFragment)
            this.updateRange($($docFragment))
        }
    }

    // 对 nodes 进行筛选
    private filterSelectionNodes($nodes: DomElement[] ): DomElement[] {
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

        return $listHtml
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
