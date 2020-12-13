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
        const editor = this.editor

        // 获取 序列标签
        const orderTarget = type.toLowerCase()

        // 获取相对应的 元属节点
        let $selectionElem = editor.selection.getSelectionContainerElem() as DomElement
        const $startElem = (editor.selection.getSelectionStartElem() as DomElement).getNodeTop(
            editor
        )
        const $endElem = (editor.selection.getSelectionEndElem() as DomElement).getNodeTop(editor)
        const $nodes = editor.selection.getSelectionRangeTopNodes()

        // 获取选区
        const _range = this.editor.selection.getRange()

        // 获取开始段落和结束段落 标签名
        const startNodeName = $startElem?.getNodeName()
        const endNodeName = $endElem?.getNodeName()

        // 容器 - HTML 文档片段
        let $containerFragment: DocumentFragment | HTMLElement

        // 获取 开始元素 和 结束元素 有问题抛出
        if (editor.$textElem.equal($startElem) || editor.$textElem.equal($endElem)) {
            return
        }

        // 防止光标的时候判断异常
        if (!editor.$textElem.equal($selectionElem)) {
            $selectionElem = $selectionElem.getNodeTop(editor)
        }

        // =====================================
        // 当 selectionElem 属于序列元素的时候
        // 代表着当前选区一定是在一个序列元素内的
        // =====================================
        if (this.isOrderElem($selectionElem as DomElement)) {
            $nodes.length = 0 // 清空

            // 获取 selectionElem 的标签名
            const containerNodeName = $selectionElem?.getNodeName()

            // 获取开始以及结束的 li 元素
            const $start = $startElem.prior
            const $end = $endElem.prior

            // =====================================
            // 当 开始节点 和 结束节点 没有 prior
            // 并且 开始节点 没有前一个兄弟节点
            // 并且 结束节点 没有后一个兄弟节点
            // 即代表 全选序列
            // =====================================
            if (
                (!$startElem.prior && !$endElem.prior) ||
                (!$start?.prev().length && !$end?.next().length)
            ) {
                // 获取当前序列下的所有 li 标签
                ;($selectionElem?.children() as DomElement).forEach(($node: HTMLElement) => {
                    $nodes.push($($node))
                })

                // =====================================
                // 当 selectionElem 的标签名和按钮类型 一致 的时候
                // 代表着当前的操作是 取消 序列
                // =====================================
                if (containerNodeName === type) {
                    // 创建 文档片段
                    $containerFragment = document.createDocumentFragment()

                    // 生成对应的段落(p)并添加到文档片段中，然后删除掉无用的 li
                    $nodes.forEach($node => {
                        const $p = document.createElement('p')
                        $p.innerHTML = $node.html()
                        $containerFragment.append($p)
                        $node.remove()
                    })
                }

                // =====================================
                // 当 selectionElem 的标签名和按钮类型 不一致 的时候
                // 代表着当前的操作是 转换 序列
                // =====================================
                else {
                    // 创建 序列节点
                    $containerFragment = document.createElement(orderTarget)

                    // 因为是转换，所以 li 元素可以直接使用
                    $nodes.forEach($node => {
                        $containerFragment.append($node.elems[0])
                    })
                }

                // 把 文档片段 或 序列节点 插入到 selectionElem 的前面
                $selectionElem
                    .parent()
                    .elems[0].insertBefore($containerFragment, $selectionElem.elems[0])

                // 删除无用的 selectionElem 因为它被掏空了
                $selectionElem.remove()
            }

            // =====================================
            // 当不是全选序列的时候就代表是非全选序列(废话)
            // 非全选序列的情况
            // =====================================
            else {
                // 获取选中的内容
                let $startDom: DomElement = $start as DomElement
                while ($startDom.length) {
                    $nodes.push($startDom)
                    $end?.equal($startDom)
                        ? ($startDom = $(undefined)) // 结束
                        : ($startDom = $startDom.next()) // 继续
                }

                // 获取开始节点的上一个兄弟节点
                const $prveDom: DomElement = ($start as DomElement).prev()
                // 获取结束节点的下一个兄弟节点
                let $nextDom: DomElement = ($end as DomElement).next()

                // =====================================
                // 当 selectionElem 的标签名和按钮类型一致的时候
                // 代表着当前的操作是 取消 序列
                // =====================================
                if (containerNodeName === type) {
                    // 创建 文档片段
                    $containerFragment = document.createDocumentFragment()

                    // 生成对应的段落(p)并添加到文档片段中，然后删除掉无用的 li
                    $nodes.forEach(($node: DomElement) => {
                        const $p: HTMLElement = document.createElement('p')
                        $p.innerHTML = $node.html()
                        $containerFragment.append($p)
                        $node.remove()
                    })
                }

                // =====================================
                // 当 selectionElem 的标签名和按钮类型不一致的时候
                // 代表着当前的操作是 转换 序列
                // =====================================
                else {
                    // 创建 文档片段
                    $containerFragment = document.createElement(orderTarget)

                    // 因为是转换，所以 li 元素可以直接使用
                    $nodes.forEach(($node: DomElement) => {
                        $containerFragment.append($node.elems[0])
                    })
                }

                // =====================================
                // 当 prveDom 和 nextDom 都存在的时候
                // 代表着当前选区是在序列的中间
                // 所以要先把 下半部分 未选择的 li 元素独立出来生成一个 序列
                // =====================================
                if ($prveDom.length && $nextDom.length) {
                    // 获取尾部的元素
                    const $tailDomArr: DomElement[] = []
                    while ($nextDom.length) {
                        $tailDomArr.push($nextDom)
                        $nextDom = $nextDom.next()
                    }

                    // 创建 尾部序列节点
                    const $tailDocFragment = document.createElement(containerNodeName)

                    // 把尾部元素节点添加到尾部序列节点中
                    $tailDomArr.forEach(($node: DomElement) => {
                        $tailDocFragment.append($node.elems[0])
                    })

                    // 把尾部序列节点插入到 selectionElem 的后面
                    $($tailDocFragment).insertAfter($selectionElem)

                    // =====================================
                    // 获取选区容器元素的父元素，一般就是编辑区域
                    // 然后判断 selectionElem 是否还有下一个兄弟节点
                    // 如果有，就把文档片段添加到 selectionElem 下一个兄弟节点前
                    // 如果没有，就把文档片段添加到 编辑区域 末尾
                    // =====================================
                    const $selectionNextDom: DomElement = $selectionElem.next()
                    $selectionNextDom.length
                        ? $selectionElem
                              .parent()
                              .elems[0].insertBefore(
                                  $containerFragment,
                                  $selectionElem.next().elems[0]
                              )
                        : $selectionElem.parent().elems[0].append($containerFragment)
                }

                // =====================================
                // 不管是 取消 还是 转换 都需要重新插入节点
                //
                // prveDom.length 等于 0 即代表选区是 selectionElem 序列的上半部分
                // 上半部分的 li 元素
                // =====================================
                else if (!$prveDom.length) {
                    // 文档片段插入到 selectionElem 之前
                    $selectionElem
                        .parent()
                        .elems[0].insertBefore($containerFragment, $selectionElem.elems[0])
                }

                // =====================================
                // 不管是 取消 还是 转换 都需要重新插入节点
                //
                // nextDom.length 等于 0 即代表选区是 selectionElem 序列的下半部分
                // 下半部分的 li 元素
                // =====================================
                else if (!$nextDom.length) {
                    // 文档片段插入到 selectionElem 之后
                    const $selectionNextElem = $selectionElem.next()
                    if ($selectionNextElem.length) {
                        $selectionElem
                            .parent()
                            .elems[0].insertBefore(
                                $containerFragment,
                                $selectionElem.next().elems[0]
                            )
                    } else {
                        $selectionElem.parent().elems[0].append($containerFragment)
                    }
                }
            }
        }

        // =====================================
        // 当 startElem 和 endElem 属于序列元素的时候
        // 代表着当前选区一定是在再两个序列的中间(包括两个序列)
        // =====================================
        else if (
            this.isOrderElem($startElem as DomElement) &&
            this.isOrderElem($endElem as DomElement)
        ) {
            // =====================================
            // 开头结尾都是序列的情况下
            // 开头序列 和 结尾序列的标签名一致的时候
            // =====================================
            if (startNodeName === endNodeName) {
                // =====================================
                // 开头序列 和 结尾序列 中间还有其他的段落的时候
                // =====================================
                if ($nodes.length > 2) {
                    // 弹出 开头 和 结尾
                    $nodes.shift()
                    $nodes.pop()

                    // 创建 文档片段
                    $containerFragment = document.createDocumentFragment()

                    // 过滤 $nodes 获取到符合要求的选中元素节点
                    const $selectionNodes = this.filterSelectionNodes($nodes)

                    // 把中间部分的节点元素转换成 li 元素并添加到文档片段后删除
                    $selectionNodes.forEach($node => {
                        const $list = document.createElement('li')
                        $list.innerHTML = $node.html()
                        $containerFragment.append($list)
                        $node.remove()
                    })

                    // =====================================
                    // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                    // 当开头序列的标签名和按钮类型 一致 的时候
                    // 代表着当前是一个 设置序列 的操作
                    // =====================================
                    if (startNodeName === type) {
                        // 把结束序列的 li 元素添加到 文档片段中
                        $endElem.children()?.forEach(($list: HTMLElement) => {
                            $containerFragment.append($list)
                        })

                        // 下序列全选被掏空了，就卸磨杀驴吧
                        $endElem.remove()

                        // 在开始序列中添加 文档片段
                        $startElem.elems[0].append($containerFragment)
                    }

                    // =====================================
                    // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                    // 当开头序列的标签名和按钮类型 不一致 的时候
                    // 代表着当前是一个 转换序列 的操作
                    // =====================================
                    else {
                        // 创建 开始序列和结束序列的文档片段
                        const $startFragment = document.createDocumentFragment()
                        const $endFragment = document.createDocumentFragment()

                        // 获取起点元素
                        let $startDom: DomElement = this.getStartPoint($startElem)
                        // 获取上半序列中的选中内容，并添加到文档片段中
                        while ($startDom.length) {
                            const _element = $startDom.elems[0]
                            $startDom = $startDom.next()
                            $startFragment.append(_element)
                        }

                        // 获取结束元素
                        let $endDom: DomElement = this.getEndPoint($endElem)
                        // 获取下半序列中选中的内容
                        const domArr: Element[] = []
                        while ($endDom.length) {
                            domArr.unshift($endDom.elems[0])
                            $endDom = $endDom.prev()
                        }
                        // 添加到文档片段中
                        domArr.forEach(($node: Element) => {
                            $endFragment.append($node)
                        })

                        // 合并文档片段
                        const $orderFragment = document.createElement(orderTarget)
                        $orderFragment.append($startFragment)
                        $orderFragment.append($containerFragment)
                        $orderFragment.append($endFragment)
                        $containerFragment = $orderFragment

                        // 插入
                        $($orderFragment).insertAfter($startElem)

                        // 序列全选被掏空了后，就卸磨杀驴吧
                        !$startElem.children()?.length && $startElem.remove()
                        !$endElem.children()?.length && $endElem.remove()
                    }
                }

                // =====================================
                // 开头序列 和 结尾序列 中间没有其他的段落
                // =====================================
                else {
                    $nodes.length = 0

                    // 获取起点元素
                    let $startDom: DomElement = this.getStartPoint($startElem)
                    // 获取上半序列中的选中内容
                    while ($startDom.length) {
                        $nodes.push($startDom)
                        $startDom = $startDom.next()
                    }

                    // 获取结束元素
                    let $endDom: DomElement = this.getEndPoint($endElem)
                    // 获取下半序列中选中的内容
                    const domArr: DomElement[] = []
                    // 获取下半序列中的选中内容
                    while ($endDom.length) {
                        domArr.unshift($endDom)
                        $endDom = $endDom.prev()
                    }

                    // 融合内容
                    $nodes.push(...domArr)

                    // =====================================
                    // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                    // 当开头序列的标签名和按钮类型 一致 的时候
                    // 代表着当前是一个 取消序列 的操作
                    // =====================================
                    if (startNodeName === type) {
                        // 创建 文档片段
                        $containerFragment = document.createDocumentFragment()
                        // 生成普通段落，并插入到文档片段中，删除无用 li 标签
                        $nodes.forEach(($list: DomElement) => {
                            const $p: HTMLElement = document.createElement('p')
                            $p.innerHTML = $list.html()
                            $containerFragment.append($p)
                            $list.remove()
                        })

                        // 插入到 endElem 前
                        $startElem
                            .parent()
                            .elems[0].insertBefore($containerFragment, $endElem.elems[0])
                    }

                    // =====================================
                    // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                    // 当开头序列的标签名和按钮类型 不一致 的时候
                    // 代表着当前是一个 设置序列 的操作
                    // =====================================
                    else {
                        // 创建 序列元素
                        $containerFragment = document.createElement(orderTarget)
                        // li 元素添加到 序列元素 中
                        $nodes.forEach(($list: DomElement) => {
                            $containerFragment.append($list.elems[0])
                        })
                        // 插入到 startElem 之后
                        $($containerFragment).insertAfter($startElem)
                    }

                    // 序列全选被掏空了后，就卸磨杀驴吧
                    !$startElem.children()?.length && $endElem.remove()
                    !$endElem.children()?.length && $endElem.remove()
                }
            }

            // =====================================
            // 由于开头序列 和 结尾序列的标签名不一样
            // 开头序列 和 设置序列类型相同
            // =====================================
            else if (startNodeName === type) {
                // 弹出开头和结尾的序列
                $nodes.shift()
                $nodes.pop()

                // 创建 文档片段
                $containerFragment = document.createDocumentFragment()
                // 元素数组
                const domArr: DomElement[] = []
                // 获取结束元素
                let $endDom: DomElement = this.getEndPoint($endElem)
                // 获取下半序列中选中的内容
                while ($endDom.length) {
                    domArr.unshift($endDom)
                    $endDom = $endDom.prev()
                }

                // 序列中间的数据 - 进行数据过滤
                const $selectionNodes = this.filterSelectionNodes($nodes)
                // 生成 li 标签，并且添加到 文档片段中，删除无用节点
                $selectionNodes.forEach($node => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $containerFragment.append($list)
                    $node.remove()
                })

                // 把尾部序列的内容添加到文档片段当中
                domArr.forEach(($list: DomElement) => {
                    $containerFragment.append($list.elems[0])
                })

                // 插入
                $startElem.elems[0].append($containerFragment)

                // 序列全选被掏空了后，就卸磨杀驴吧
                !$endElem.children()?.length && $endElem.remove()
            }

            // =====================================
            // 由于开头序列 和 结尾序列的标签名不一样
            // 结尾序列 和 设置序列类型相同
            // if(endNodeName === type)
            // =====================================
            else {
                // 弹出开头和结尾的序列
                $nodes.shift()
                $nodes.pop()

                // 创建 文档片段
                $containerFragment = document.createDocumentFragment()
                // 获取起点元素
                let $startDom: DomElement = this.getStartPoint($startElem)
                // 获取上半序列中的选中内容
                while ($startDom.length) {
                    const _element = $startDom.elems[0]
                    $startDom = $startDom.next()
                    $containerFragment.append(_element)
                }

                // 序列中间的数据 - 进行数据过滤
                const $selectionNodes = this.filterSelectionNodes($nodes)
                // 生成 li 标签，并且添加到 文档片段中，删除无用节点
                $selectionNodes.forEach($node => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $containerFragment.append($list)
                    $node.remove()
                })

                // 插入到 结束序列 的顶部(作为子元素)
                $endElem.elems[0].insertBefore(
                    $containerFragment,
                    $endElem.children()?.elems[0] as HTMLElement
                )
            }
        }

        // =====================================
        // 选区开始元素为 序列 的时候
        // =====================================
        else if (this.isOrderElem($startElem as DomElement)) {
            // 弹出 开头序列
            $nodes.shift()

            // =====================================
            // 当前序列类型和开头序列的类型 一致
            // 代表当前是一个 融合(把其他段落加入到开头序列中) 的操作
            // =====================================
            if (startNodeName === type) {
                // 创建 文档片段
                $containerFragment = document.createDocumentFragment()
                // 过滤元素节点数据
                const $selectionNodes = this.filterSelectionNodes($nodes)
                // 生成 li 元属，并删除
                $selectionNodes.forEach($node => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $containerFragment.append($list)
                    $node.remove()
                })

                // 插入到开始序列末尾
                $startElem.elems[0].append($containerFragment)
            }

            // =====================================
            // 当前序列类型和开头序列的类型 不一致
            // 代表当前是一个 设置序列 的操作
            // =====================================
            else {
                // 创建 序列节点
                $containerFragment = document.createElement(orderTarget)

                // 获取起点元素
                let $startDom: DomElement = this.getStartPoint($startElem)
                // 获取上半序列中的选中内容，并添加到文档片段中
                while ($startDom.length) {
                    const _element = $startDom.elems[0]
                    $startDom = $startDom.next()
                    $containerFragment.append(_element)
                }

                // 过滤普通节点
                const $selectionNodes = this.filterSelectionNodes($nodes)
                // 生成 li 元素，并添加到 序列节点 当中，删除无用节点
                $selectionNodes.forEach(($node: DomElement) => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $containerFragment.append($list)
                    $node.remove()
                })

                // 插入到开始元素
                $($containerFragment).insertAfter($startElem)

                // 序列全选被掏空了后，就卸磨杀驴吧
                !$startElem.children()?.length && $startElem.remove()
            }
        }

        // =====================================
        // 选区结束元素为 序列 的时候
        // =====================================
        else if (this.isOrderElem($endElem as DomElement)) {
            // 弹出 结束序列
            $nodes.pop()

            // =====================================
            // 当前序列类型和结束序列的类型 一致
            // 代表当前是一个 融合(把其他段落加入到结束序列中) 的操作
            // =====================================
            if (endNodeName === type) {
                // 创建 文档片段
                $containerFragment = document.createDocumentFragment()
                // 过滤元素节点数据
                const $selectionNodes = this.filterSelectionNodes($nodes)
                // 生成 li 元属，并删除
                $selectionNodes.forEach(($node: DomElement) => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $containerFragment.append($list)
                    $node.remove()
                })

                // 插入到结束序列之前
                $endElem.elems[0].insertBefore(
                    $containerFragment,
                    $endElem.children()?.elems[0] as HTMLElement
                )
            }

            // =====================================
            // 当前序列类型和结束序列的类型 不一致
            // 代表当前是一个 设置序列 的操作
            // =====================================
            else {
                // 创建 序列节点
                $containerFragment = document.createElement(orderTarget)
                // 过滤元素节点数据
                const $selectionNodes = this.filterSelectionNodes($nodes)
                // 元素数组
                const domArr: DomElement[] = []
                // 获取结束元素
                let $endDom: DomElement = this.getEndPoint($endElem)
                // 获取下半序列中选中的内容
                while ($endDom.length) {
                    domArr.unshift($endDom)
                    $endDom = $endDom.prev()
                }

                // 把下序列的内容添加到过滤元素中
                $selectionNodes.push(...domArr)
                // 生成 li 元素并且添加到序列节点后删除原节点
                $selectionNodes.forEach(($node: DomElement) => {
                    const $list = document.createElement('li')
                    $list.innerHTML = $node.html()
                    $containerFragment.append($list)
                    $node.remove()
                })

                // 插入到结束序列之前
                $($containerFragment).insertBefore($endElem)

                // 序列全选被掏空了后，就卸磨杀驴吧
                !$endElem.children()?.length && $endElem.remove()
            }
        }

        // =====================================
        // 当选区不是序列内且开头和结尾不是序列的时候
        // 直接获取所有顶级段落然后过滤
        // 代表着 设置序列 的操作
        // =====================================
        else {
            // 创建 序列节点
            $containerFragment = document.createElement(orderTarget)
            // 过滤选取的元素
            const $selectionNodes = this.filterSelectionNodes($nodes)
            // 生成 li 元素并且添加到序列节点后删除原节点
            $selectionNodes.forEach(($node: DomElement) => {
                const $list = document.createElement('li')
                $list.innerHTML = $node.html()
                $containerFragment.append($list)
                $node.remove()
            })

            _range?.insertNode($containerFragment) // 插入节点到选区
        }

        // 更新选区
        // this.updateRange($($containerFragment.children))
    }

    // 对 nodes 进行筛选
    private filterSelectionNodes($nodes: DomElement[]): DomElement[] {
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
     * 更新选区
     * @param $node
     */
    private updateRange($node: DomElement) {
        this.editor.selection.createRangeByElem($node, false, true)
        this.editor.selection.restoreSelection()
    }

    /**
     * 是否是序列元素节点 UL and OL
     * @param $node
     */
    private isOrderElem($node: DomElement) {
        const nodeName = $node.getNodeName()
        if (nodeName === ListType.OrderedList || nodeName === ListType.UnorderedList) {
            return true
        }

        return false
    }

    /**
     * 获取起点元素
     * @param $startElem 开始序列节点
     */
    getStartPoint($startElem: DomElement): DomElement {
        return $startElem.prior
            ? $startElem.prior // 有 prior 代表不是全选序列
            : $($startElem.children()?.elems[0]) // 没有则代表全选序列
    }

    /**
     * 获取结束元素
     * @param $endElem 结束序列节点
     */
    getEndPoint($endElem: DomElement): DomElement {
        return $endElem.prior
            ? $endElem.prior // 有 prior 代表不是全选序列
            : $($endElem.children()?.last().elems[0]) // 没有则代表全选序列
    }

    public tryChangeActive(): void {}
}

export default List
