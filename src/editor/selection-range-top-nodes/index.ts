/**
 * @description 选取范围所有顶级(段落)节点
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../index'

// 构造函数
class SelectionRangeTopNodes {
    // 定义属性
    editor: Editor
    $nodeList: DomElement[]
    $startElem: DomElement | undefined
    $endElem: DomElement | undefined

    /**
     * 构造函数
     * @param editor
     */
    constructor(editor: Editor) {
        // 初始化属性
        this.editor = editor
        this.$nodeList = []
        this.$startElem = $(editor.selection.getSelectionStartElem()).getNodeTop(this.editor)
        this.$endElem = $(editor.selection.getSelectionEndElem()).getNodeTop(this.editor)
    }

    /**
     * 初始化
     */
    public init(): void {
        this.recordSelectionNodes($(this.$startElem))
    }

    /**
     * 添加 节点 到nodeList
     * @param $node 节点
     */
    private addNodeList($node: DomElement | HTMLElement): void {
        this.$nodeList.push($($node))
    }

    /**
     * 是否是 选区结束 节点
     * @param $node 节点
     */
    private isEndElem($node: DomElement): boolean | undefined {
        return this.$endElem?.equal($node)
    }

    /**
     * 获取当前节点的下一个兄弟节点
     * @param $node 节点
     */
    private getNextSibling($node: DomElement): DomElement {
        return $($node.elems[0].nextSibling)
    }

    /**
     * 记录节点 - 从选区开始节点开始 一直到匹配到选区结束节点为止
     * @param $node 节点
     */
    private recordSelectionNodes($node: DomElement): void {
        const $elem = $node.getNodeTop(this.editor)
        if ($elem.length > 0) {
            this.addNodeList($elem)
            if (!this.isEndElem($elem)) {
                this.recordSelectionNodes(this.getNextSibling($elem))
            }
        }
    }

    /**
     * 获取 选中节点列表
     */
    public getSelectionNodes(): DomElement[] {
        return this.$nodeList
    }
}

/**
 * 导出
 */
export default SelectionRangeTopNodes
