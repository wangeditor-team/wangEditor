import { ListType } from '.'
import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'

/**
 * 过滤 选择的 node 节点
 * @returns { DomElement[] } DomElement[]
 */
export function filterSelectionNodes($nodes: DomElement[]): DomElement[] {
    const $listHtml: DomElement[] = []
    $nodes.forEach(($node: DomElement) => {
        const targerName = $node.getNodeName()
        if (targerName !== ListType.OrderedList && targerName !== ListType.UnorderedList) {
            // 非序列
            $listHtml.push($node)
        } else {
            // 序列
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

export function updateRange(editor: Editor, $node: DomElement, collapsed: boolean) {
    const selection = editor.selection
    const range = document.createRange()

    // ===============================
    // length 大于 1
    // 代表着转换是一个文档节点多段落
    // ===============================
    if ($node.length > 1) {
        range.setStart($node.elems[0], 0)
        range.setEnd($node.elems[$node.length - 1], $node.elems[$node.length - 1].childNodes.length)
    }

    // ===============================
    // 序列节点 或 单段落
    // ===============================
    else {
        range.selectNodeContents($node.elems[0])
    }

    // ===============================
    // collapsed 为 true 代表是光标
    // ===============================
    collapsed && range.collapse(false)
    selection.saveRange(range)
    selection.restoreSelection()
}

/**
 * 获取起点元素
 * @param $startElem 开始序列节点
 */
export function getStartPoint($startElem: DomElement): DomElement {
    return $startElem.prior
        ? $startElem.prior // 有 prior 代表不是全选序列
        : $($startElem.children()?.elems[0]) // 没有则代表全选序列
}

/**
 * 获取结束元素
 * @param $endElem 结束序列节点
 */
export function getEndPoint($endElem: DomElement): DomElement {
    return $endElem.prior
        ? $endElem.prior // 有 prior 代表不是全选序列
        : $($endElem.children()?.last().elems[0]) // 没有则代表全选序列
}
