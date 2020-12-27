import { ContainerFragment } from '.'
import { DomElement } from '../../../utils/dom-core'
import { Exec, HandlerListOptions, ListHandle } from './ListHandle'
import { filterSelectionNodes } from '../utils'

export default class OtherListHandle extends ListHandle implements Exec {
    public range: Range

    constructor(options: HandlerListOptions, range: Range) {
        super(options)

        this.range = range
    }

    exec(): ContainerFragment {
        const { editor, lsitTarget, selectionRangeElem } = this.options

        // 容器 - HTML 文档片段
        let $containerFragment: ContainerFragment

        // 获取选中的段落
        const $nodes: DomElement[] = editor.selection.getSelectionRangeTopNodes()

        // 创建 序列节点
        $containerFragment = document.createElement(lsitTarget)
        // 过滤选取的元素
        const $selectionNodes = filterSelectionNodes($nodes)
        // 生成 li 元素并且添加到序列节点后删除原节点
        $selectionNodes.forEach(($node: DomElement) => {
            const $list = document.createElement('li')
            $list.innerHTML = $node.html()
            $containerFragment.append($list)
            $node.remove()
        })

        // 插入节点到选区
        selectionRangeElem.set($containerFragment)
        this.range.insertNode($containerFragment)

        return $containerFragment
    }
}
