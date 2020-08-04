/**
 * @description 代码 菜单
 * @author lkw
 */

import PanelMenu from '../menu-constructors/PanelMenu'
import Editor from '../../editor/index'
import $ from '../../utils/dom-core'
import createPanelConf from './create-panel-conf'
import isActive from './is-active'
import Panel from '../menu-constructors/Panel'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event/index'

class Code extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-terminal"></i></div>')
        super($elem, editor)

        // 绑定事件，如点击代码时，可以查看代码
        bindEvent(editor)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        let $codeElem

        if (this.isActive) {
            // 菜单被激活，说明选区在代码里
            $codeElem = editor.selection.getSelectionTopContainerElem('CODE')
            if (!$codeElem) {
                return
            }

            // 弹出 panel
            // @ts-ignore
            this.createPanel($codeElem.text())
        } else {
            // 菜单未被激活，说明选区不在代码里
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
     * @param text 代码文本
     * @param languageType 代码类型
     */
    public createPanel(text: string, languageType: string): void {
        const conf = createPanelConf(this.editor, text, languageType)
        const panel = new Panel(this, conf)
        panel.create()

        this.setPanel(panel)
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

export default Code
