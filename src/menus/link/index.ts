/**
 * @description 链接 菜单
 * @author wangfupeng
 */

import PanelMenu from '../menu-constructors/PanelMenu'
import Editor from '../../editor/index'
import $, { DomElement } from '../../utils/dom-core'
import createPanelConf from './create-panel-conf'
import isActive from './is-active'
import Panel from '../menu-constructors/Panel'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event/index'
import { EMPTY_P } from '../../utils/const'

class Link extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            '<div class="w-e-menu" data-title="链接"><i class="w-e-icon-link"></i></div>'
        )
        super($elem, editor)

        // 绑定事件，如点击链接时，可以查看链接
        bindEvent(editor)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        let $linkElem

        /**
            @author:Gavin
            @description 
                解决当全选删除编辑区内容时，点击链接没反应的问题(因为选区有问题)
              
        **/
        let $selectionElem = editor.selection.getSelectionContainerElem()
        const $textElem = editor.$textElem
        const html = $textElem.html()
        const $txtHtml = html.trim()

        if ($txtHtml === EMPTY_P) {
            const $emptyChild = $textElem.children()
            // 调整选区
            editor.selection.createRangeByElem($emptyChild as DomElement, true, true)

            // 重新获取选区
            $selectionElem = editor.selection.getSelectionContainerElem()
        }

        // 判断是否是多行 多行则退出 否则会出现问题
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            return
        }

        if (this.isActive) {
            // 菜单被激活，说明选区在链接里
            $linkElem = editor.selection.getSelectionContainerElem()
            if (!$linkElem) {
                return
            }

            // 弹出 panel
            this.createPanel($linkElem.text(), $linkElem.attr('href'))
        } else {
            // 菜单未被激活，说明选区不在链接里
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this.createPanel('', '')
            } else {
                // 选中内容了
                this.createPanel(editor.selection.getSelectionText(), '')
            }
        }
    }

    /**
     * 创建 panel
     * @param text 文本
     * @param link 链接
     */
    private createPanel(text: string, link: string): void {
        const conf = createPanelConf(this.editor)
        const panel = new Panel(this, conf)
        panel.create()

        const { inputLinkId, inputTextId } = conf
        this.setValueForInput(inputTextId, text)
        this.setValueForInput(inputLinkId, link)
    }

    /**
     * 给input框赋值，修复在tpl赋值中遇到内容为">的情况下input框错位问题
     * @param inputId 输入框id
     * @param inputValue 输入框内容
     */
    private setValueForInput(inputId: string, inputValue: string) {
        const input = $(`#${inputId}`).elems[0] as HTMLInputElement
        input.value = inputValue
    }

    /**
     * 尝试修改菜单 active 状态
     */
    public tryChangeActive() {
        const editor = this.editor
        if (isActive(editor)) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Link
