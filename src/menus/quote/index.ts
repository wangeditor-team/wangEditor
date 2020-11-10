/**
 * @description 引用
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import BtnMenu from '../menu-constructors/BtnMenu'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event'

class Quote extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-quotes-left"></i>
            </div>`
        )
        super($elem, editor)
        bindEvent(editor)
    }

    /**
     * 点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        const isSelectEmpty = editor.selection.isSelectionEmpty()
        const $topNodeElem = editor.selection.getSelectionRangeTopNodes(editor)[0]
        const nodeName = this.getTopNodeName()

        if (isSelectEmpty) {
            // 选区范围是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange()
        }
        // IE 中不支持 formatBlock <BLOCKQUOTE> ，要用其他方式兼容
        // 兼容firefox无法取消blockquote的问题
        const nodeList = $topNodeElem.getNode().childNodes
        if (nodeName === 'P') {
            // 将 P 转换为 quote
            const $targetELem = $(`<blockquote></blockquote>`)
            const targetElem = $targetELem.getNode()
            const insertNode = $topNodeElem.getNode()
            this.insertNode(targetElem, insertNode)
            $targetELem.insertAfter($topNodeElem)
            $topNodeElem.remove()
            editor.selection.moveCursor($targetELem.getNode())
            // 防止最后一行无法跳出
            $(`<p><br></p>`).insertAfter($targetELem)
            return
        }
        if (nodeName === 'BLOCKQUOTE') {
            // 撤销 quote
            const $targetELem = $($topNodeElem.childNodes())
            const len = $targetELem.length
            let $middle = $topNodeElem
            console.log($targetELem)
            $targetELem.forEach((elem: Node) => {
                console.log(elem)
                const $elem = $(elem)
                $elem.insertAfter($middle)
                $middle = $elem
            })
            $topNodeElem.remove()
            editor.selection.moveCursor($targetELem.elems[len - 1])
        }

        if (isSelectEmpty) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange()
            editor.selection.restoreSelection()
        }
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {
        const editor = this.editor
        const cmdValue = editor.cmd.queryCommandValue('formatBlock')
        if (cmdValue === 'blockquote') {
            this.active()
        } else {
            this.unActive()
        }
    }

    /**
     * 获取包裹在最外层的节点(防止内部嵌入多个样式)
     * @param selectionElem 选中的节点
     * @returns {string} 最终要处理的节点名称
     */
    private getTopNodeName(): string {
        const editor = this.editor
        const $topNodeElem = editor.selection.getSelectionRangeTopNodes(editor)[0]
        console.log(editor.selection.getSelectionRangeTopNodes(editor))
        const nodeName = $topNodeElem.getNodeName()
        console.log(nodeName)

        return nodeName
    }

    /**
     * 将node插入element中，并做一些特殊化处理
     * @param element 需要插入的父节点
     * @param node 需要插入的node
     */
    // private insertNode(element: Node, nodeList: NodeList) {
    //     nodeList.forEach((node, i) => {
    //         // 去除空节点
    //         if (node.nodeName && node.textContent !== null) {
    //             if (node.nodeName !== 'BR' || i !== nodeList.length - 1) {
    //                 // 去除最后的br
    //                 element.appendChild(node.cloneNode(true))
    //             }
    //         }
    //     })
    // }
    private insertNode(element: Node, node: Node) {
        let clearNode = $('<p></p>').getNode()
        // 获取内容节点去除其他多余节点
        clearNode.appendChild(node.childNodes[0])
        element.appendChild(clearNode)
    }
}

export default Quote
