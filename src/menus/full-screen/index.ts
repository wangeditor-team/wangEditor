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
const iconExitFullScreenText = 'w-e-icon-fullscreen_exit' // 退出全屏icon class
const classfullScreenEditor = 'w-e-full-screen-editor' // 全屏添加至编辑器的class

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
        const $elem = this.$elem
        const editor = this.editor
        const $editor = $(editor.toolbarSelector)
        const $textContainerElem = editor.$textContainerElem
        const $iconElem = $elem.find('i')
        const config = editor.config

        if ($iconElem.hasClass(iconFullScreenText)) {
            $iconElem.removeClass(iconFullScreenText)
            $iconElem.addClass(iconExitFullScreenText)

            // 全屏
            $editor.addClass(classfullScreenEditor)
            $editor.css('z-index', config.zIndexFullScreen)
            $textContainerElem.css('height', '100%')
        } else {
            $iconElem.removeClass(iconExitFullScreenText)
            $iconElem.addClass(iconFullScreenText)

            // 退出全屏
            $editor.removeClass(classfullScreenEditor)
            $editor.css('z-index', 'auto')
            $textContainerElem.css('height', config.height + 'px')
        }
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {}
}

export default FullScreen
