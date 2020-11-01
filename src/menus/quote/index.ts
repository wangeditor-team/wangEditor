/**
 * @description 引用
 * @author tonghan
 */

import $, { DomElement } from '../../utils/dom-core'
import { UA } from '../../utils/util'
import Editor from '../../editor/index'
import BtnMenu from '../menu-constructors/BtnMenu'
import { MenuActive } from '../menu-constructors/Menu'

class Quote extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-quotes-left"></i>
            </div>`
        )
        super($elem, editor)
    }

    /**
     * 点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        const isSelectEmpty = editor.selection.isSelectionEmpty()
        const $selectionElem = editor.selection.getSelectionContainerElem() as DomElement
        const $topNodeElem = editor.selection.getSelectionRangeTopNodes(editor)[0]
        const nodeName = this.getTopNodeName()

        if (isSelectEmpty) {
            // 选区范围是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange()
        }
        console.log(nodeName)
        if (UA.isIE() || UA.isFirefox || UA.isOldEdge) {
            // IE 中不支持 formatBlock <BLOCKQUOTE> ，要用其他方式兼容
            // 兼容firefox无法取消blockquote的问题
            let $targetELem
            const cloneNode = $topNodeElem.getNdoe().firstChild?.cloneNode(true) as ChildNode
            if (nodeName === 'P') {
                // 将 P 转换为 quote
                const targetElem = document.createElement('blockquote')
                targetElem.appendChild(cloneNode)
                $targetELem = $(targetElem)
                $targetELem.insertAfter($topNodeElem)
                $selectionElem.remove()
                editor.selection.moveCursor($targetELem.getNdoe())
                return
            }
            if (nodeName === 'BLOCKQUOTE') {
                // 撤销 quote
                const targetElem = document.createElement('p')
                targetElem.appendChild(cloneNode)
                $targetELem = $(targetElem)
                $targetELem.insertAfter($topNodeElem)
                $selectionElem.remove()
                editor.selection.moveCursor($targetELem.elems[0])
            }
        } else {
            // 执行 formatBlock 命令
            if (nodeName === 'BLOCKQUOTE') {
                editor.cmd.do('formatBlock', '<p>')
            } else {
                editor.cmd.do('formatBlock', '<blockquote>')
            }
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
        const nodeName = $topNodeElem.getNodeName()

        return nodeName
    }
}

export default Quote
