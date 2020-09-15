/**
 * @description 全屏菜单
 * @author zhengwenjian
 */

import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import BtnMenu from '../menu-constructors/BtnMenu'
import { MenuActive } from '../menu-constructors/Menu'

import '../../assets/style/full-screen.less'

const iconFullScreenText = 'w-e-icon-fullscreen' // 全屏icon class
class FullScreen extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="${iconFullScreenText}"></i>
            </div>`
        )
        super($elem, editor)
    }

    /**
     * 点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        if (!this.isActive) {
            editor.fullScreen()
        } else {
            editor.unFullScreen()
        }
        this.tryChangeActive()
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {
        const $elem = this.$elem
        const $iconElem = $elem.find('i')
        if ($iconElem.hasClass(iconFullScreenText)) {
            this.unActive()
        } else {
            this.active()
        }
    }
}

export default FullScreen
