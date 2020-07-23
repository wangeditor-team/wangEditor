/**
 * @description 封装 获取选中多段落节点 操作
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import getParagraph from './get-paragraph'

// 构造函数
class GetParagraphs {
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
        this.$startElem = getParagraph($(editor.selection.getSelectionStartElem()), this.editor)
        this.$endElem = getParagraph($(editor.selection.getSelectionEndElem()), this.editor)
    }

    /**
     * 初始化
     */
    init(): void {
        this.recordSelectionNodes($(this.$startElem))
    }

    /**
     * 添加 节点 到nodeList
     * @param $node 节点
     */
    addNodeList($node: DomElement | HTMLElement): void {
        this.$nodeList.push($($node))
    }

    /**
     * 是否是 选区结束 节点
     * @param $node 节点
     */
    isEndElem($node: DomElement): boolean | undefined {
        return this.$endElem?.equal($node)
    }

    /**
     * 获取当前节点的下一个兄弟节点
     * @param $node 节点
     */
    getNextSibling($node: DomElement): DomElement {
        return $($node.elems[0].nextSibling)
    }

    /**
     * 记录节点 - 从选区开始节点开始 一直到匹配到选区结束节点为止
     * @param $node 节点
     */
    recordSelectionNodes($node: DomElement): void {
        const $elem = getParagraph($node, this.editor)
        this.addNodeList($elem)
        if (!this.isEndElem($elem)) {
            this.recordSelectionNodes(this.getNextSibling($elem))
        }
    }

    /**
     * 获取 选中节点列表
     */
    getSelectionNodes(): DomElement[] {
        return this.$nodeList
    }
}

/**
 * 直接返回 选中节点列表
 */
export default function getParagraphs(editor: Editor): DomElement[] {
    const getParagraphs = new GetParagraphs(editor)
    getParagraphs.init()
    return getParagraphs.getSelectionNodes()
}
