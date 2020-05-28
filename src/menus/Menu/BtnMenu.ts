/**
 * @description 按钮菜单 Class
 * @author wangfupeng
 */

import { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import Menu from './Menu'

class BtnMenu extends Menu {
    constructor($elem: DomElement, editor: Editor) {
        super($elem, editor)

        // 绑定菜单点击事件
        $elem.on('click', (e: Event) => {
            if (editor.selection.getRange() == null) {
                return
            }
            this.clickHandler(e)
        })
    }

    /**
     * 菜单点击事件
     * @param e event
     */
    protected clickHandler(e: Event): void {}
}

export default BtnMenu
