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

export function formatCodeHtml(editor: Editor, html: string) {
    let codeArr = editor.$textElem.elems[0].querySelectorAll('pre')
    for (let i = 0; i < codeArr.length; i++) {
        html = html.replace(
            codeArr[i].outerHTML,
            `<pre><code>${codeArr[i].getAttribute('text')}</code></pre>`
        )
    }

    return html
}

class Code extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-terminal"></i></div>')
        super($elem, editor)

        // 绑定事件，如点击链接时，可以查看链接
        bindEvent(editor)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        let $codeElem
        const selectionText = editor.selection.getSelectionText()

        if (this.isActive) {
            // 菜单被激活，说明选区在链接里
            $codeElem = editor.selection.getSelectionTopContainerElem('PRE')
            if (!$codeElem) {
                if (editor.selection.isSelectionEmpty()) {
                    return
                }

                if (editor.selection.getSelectionTopContainerElem('CODE')) {
                    // editor.cmd.do('formatBlock', '<p>')
                    return
                } else {
                    editor.cmd.do('insertHTML', `<code>${selectionText}</code>`)
                }

                return
            }

            // 弹出 panel
            // @ts-ignore
            this.createPanel($codeElem.attr('text'))
        } else {
            // 菜单未被激活，说明选区不在链接里
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this.createPanel('', '')
            } else {
                // 选中内容了
                editor.cmd.do('insertHTML', `<code>${selectionText}</code>`)
                editor.cmd.do('insertHTML', `<p><br></p>`)
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
