import { ContainerFragment } from '.'
import $, { DomElement } from '../../../utils/dom-core'
import { Exec, HandlerListOptions, ListHandle } from './ListHandle'
import { filterSelectionNodes, getEndPoint } from '../utils'

export default class EndJoinListHandle extends ListHandle implements Exec {
    constructor(options: HandlerListOptions) {
        super(options)
    }

    exec(): ContainerFragment {
        const { editor, listType, lsitTarget, selectionRangeElem, $endElem } = this.options

        // 容器 - HTML 文档片段
        let $containerFragment: ContainerFragment

        // 获取选中的段落
        const $nodes: DomElement[] = editor.selection.getSelectionRangeTopNodes()

        // 获取结束段落标签名
        const endNodeName = $endElem?.getNodeName()

        // 弹出 结束序列
        $nodes.pop()

        // =====================================
        // 当前序列类型和结束序列的类型 一致
        // 代表当前是一个 融合(把其他段落加入到结束序列中) 的操作
        // =====================================
        if (endNodeName === listType) {
            // 创建 文档片段
            $containerFragment = document.createDocumentFragment()
            // 过滤元素节点数据
            const $selectionNodes = filterSelectionNodes($nodes)
            // 生成 li 元属，并删除
            $selectionNodes.forEach(($node: DomElement) => {
                const $list = document.createElement('li')
                $list.innerHTML = $node.html()
                $containerFragment.append($list)
                $node.remove()
            })

            // 插入到结束序列之前
            selectionRangeElem.set($containerFragment)
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
            $containerFragment = document.createElement(lsitTarget)
            // 过滤元素节点数据
            const $selectionNodes = filterSelectionNodes($nodes)
            // 元素数组
            const domArr: DomElement[] = []
            // 获取结束元素
            let $endDom: DomElement = getEndPoint($endElem)
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
            selectionRangeElem.set($containerFragment)
            $($containerFragment).insertBefore($endElem)

            // 序列全选被掏空了后，就卸磨杀驴吧
            !$endElem.children()?.length && $endElem.remove()
        }

        return $containerFragment
    }
}
