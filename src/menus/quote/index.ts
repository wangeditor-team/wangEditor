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
        const nodeName = this.getQuoteNodeName($selectionElem)

        // if (nodeName !== "P" && nodeName !== "BLOCKQUOTE") {
        //     // 当nodeName不为p 和 BLOCKQUOTE 取其父节点，防止无法quote操作失效
        //     nodeName = $(parentNode).getNodeName()
        // }

        if (isSelectEmpty) {
            // 选区范围是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange()
        }

        if (UA.isIE()) {
            // IE 中不支持 formatBlock <BLOCKQUOTE> ，要用其他方式兼容
            let content, $targetELem
            if (nodeName === 'P') {
                // 将 P 转换为 quote
                content = $selectionElem.text()
                $targetELem = $(`<blockquote>${content}</blockquote>`)
                $targetELem.insertAfter($selectionElem)
                $selectionElem.remove()
                return
            }
            if (nodeName === 'BLOCKQUOTE') {
                // 撤销 quote
                content = $selectionElem.text()
                $targetELem = $(`<p>${content}</p>`)
                $targetELem.insertAfter($selectionElem)
                $selectionElem.remove()
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
    private getQuoteNodeName(selectionElem: DomElement): string {
        let nodeName = selectionElem.getNodeName()
        let parentNode = $(nodeName).parent()

        if (nodeName !== 'P' && nodeName !== 'BLOCKQUOTE') {
            nodeName = this.getQuoteNodeName(parentNode)
        }
        return nodeName
    }
}

export default Quote
