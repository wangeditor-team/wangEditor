/**
 * @description 封装 获取选中多段落节点 操作
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'

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
        this.$startElem = editor.selection.getSelectionStartElem()
        this.$endElem = editor.selection.getSelectionEndElem()
    }

    /**
     * 初始化
     */
    init() {
        this.recordSelectionNodes($(this.$startElem))
    }

    /**
     * 添加 节点 到nodeList
     * @param $node 节点
     */
    addNodeList($node: DomElement | HTMLElement) {
        this.$nodeList.push($($node))
    }

    /**
     * 是否是 选区结束 节点
     * @param $node 节点
     */
    isEndElem($node: DomElement) {
        return this.$endElem?.equal($node)
    }

    /**
     * 获取当前节点的下一个兄弟节点
     * @param $node 节点
     */
    getNextSibling($node: DomElement) {
        return $($node.elems[0].nextSibling)
    }

    /**
     * 记录节点 - 从选区开始节点开始 一直到匹配到选区结束节点为止
     * @param $node 节点
     */
    recordSelectionNodes($node: DomElement) {
        this.addNodeList($node)
        if (!this.isEndElem($node)) {
            this.recordSelectionNodes(this.getNextSibling($node))
        }
    }

    /**
     * 获取 选中节点列表
     */
    getSelectionNodes() {
        return this.$nodeList
    }
}

/**
 * 直接返回 选中节点列表
 */
export default function getParagraphs(editor: Editor) {
    const getParagraphs = new GetParagraphs(editor)
    getParagraphs.init()
    return getParagraphs.getSelectionNodes()
}
