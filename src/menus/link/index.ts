/**
 * @description 链接 菜单
 * @author wangfupeng
 */

import PanelMenu from '../menu-constructors/PanelMenu'
import Editor from '../../editor/index'
import $ from '../../utils/dom-core'
import createPanelConf from './create-panel-conf'
import isActive from './is-active'
import Panel from '../menu-constructors/Panel'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event/index'

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
        const conf = createPanelConf(this.editor, text, link)
        const panel = new Panel(this, conf)
        panel.create()
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
