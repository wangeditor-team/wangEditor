/**
 * @description 获取dom节点
 * @author lichunlin
 */

import $, { DomElement } from '../../../../utils/dom-core'
import Editor from '../../../../editor/index'

class getNode {
    public editor: Editor
    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * 获取焦点所在行
     * @param $node 当前table
     */
    public getLineNode($node: HTMLElement): HTMLElement {
        let DOM: HTMLElement = $($node).elems[0]
        if (!DOM.parentNode) {
            return DOM
        }
        function getParentNode($node: HTMLElement, editor: Editor): HTMLElement {
            const $parent = $($node.parentNode)
            if ($($parent.elems[0]).getNodeName() === 'TR') {
                return $parent.elems[0]
            } else {
                return getParentNode($parent.elems[0], editor)
            }
        }
        DOM = getParentNode(DOM, this.editor)

        return DOM
    }

    /**
     * 获取当前行的下标
     * @param $node 当前table
     * @param $dmo 当前行节点
     */
    public getCurrentLineIndex($node: HTMLElement, $dom: HTMLElement): Number {
        let _index: number = 0
        $node.childNodes[0].childNodes.forEach((item, index) => {
            item === $dom ? (_index = index) : ''
        })
        return _index
    }

    /**
     * 获取当前列的下标
     * @param $node 当前点击元素
     */
    public getCurrentRowIndex($node: HTMLElement): number {
        //当前行
        let _index: number = 0
        //获取当前列 td或th
        let rowDom =
            $($node).getNodeName() === 'TD' || $($node).getNodeName() === 'TH'
                ? $node
                : $($node).parentUntil('TD', $node)?.elems[0]
        let lineDom = $(rowDom).parent()
        lineDom.elems[0].childNodes.forEach((item, index) => {
            item === rowDom ? (_index = index) : ''
        })
        return _index
    }

    /**
     * 返回元素html字符串
     * @param $node
     */
    public getNodeHtml($node: HTMLElement): string {
        let div = document.createElement('div')
        div.appendChild($node.cloneNode(true))
        const htmlStr = div.innerHTML
        return htmlStr
    }

    public getDesignatedNode() {}
}

export default getNode
