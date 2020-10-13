/**
 * @description 撤销
 * @author tonghan
 */

import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import BtnMenu from '../menu-constructors/BtnMenu'
import { MenuActive } from '../menu-constructors/Menu'

class Undo extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-undo"></i>
            </div>`
        )
        super($elem, editor)
    }

    /**
     * 点击事件
     */
    public clickHandler(): void {
        this.editor.history.revoke()
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {
        // 标准模式下才进行操作
        if (!this.editor.isCompatibleMode) {
            if (this.editor.history.size[0]) {
                this.active()
            } else {
                this.unActive()
            }
        }
    }
}

export default Undo
