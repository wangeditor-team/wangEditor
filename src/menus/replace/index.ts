/**
 * @description 查找替换
 * @author TanShun
 */

import $ from '../../utils/dom-core'
import PanelMenu from '../menu-constructors/PanelMenu'
import { MenuActive } from '../menu-constructors/Menu'
import Editor from '../../editor/index'
import createPanelConf from './create-panel-conf'
import Panel from '../menu-constructors/Panel'

class Replace extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="${editor.i18next.t('menus.title.查找替换')}">
                <i class="w-e-icon-replace"></i>
            </div>`
        )
        super($elem, editor)
    }

    public clickHandler(e: Event): void {
        const conf = createPanelConf(this.editor, this.editor.selection.getSelectionText())
        const panel = new Panel(this, conf)
        panel.create()

        // 如果查找框内有值，面板打开后光标将聚焦在替换框中
        let $inputs = panel.$container.find('input[type=text]')
        if (($inputs.elems[0] as HTMLInputElement).value != '') {
            $inputs.elems[1].focus()
        }

        panel.$container.on('keypress', (e: KeyboardEvent) => {
            if (e.code == 'Enter') {
                if (document.activeElement == $inputs.elems[0]) {
                    // 如果当前光标位于查找框，按下回车键后光标将聚焦在替换框
                    $inputs.elems[1].focus()
                } else if (document.activeElement == $inputs.elems[1]) {
                    // 如果当前光标位于替换框，按下回车键后将模拟点击全部替换按钮
                    panel.$container.find('button').elems[0].click()
                }
            }
        })
    }

    tryChangeActive(): void {}
}

export default Replace
