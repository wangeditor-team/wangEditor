/**
 * @description Modal 菜单 Class
 * @author wangfupeng
 */

import { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import Menu from './Menu'
import Panel, { PanelConf } from './Panel'

class PanelMenu extends Menu {
    panel: Panel | undefined

    constructor($elem: DomElement, editor: Editor) {
        super($elem, editor)

        // 绑定菜单点击事件
        $elem.on('click', (e: Event) => {
            e.stopPropagation()
            if (editor.selection.getRange() == null) {
                return
            }
            this.clickHandler(e)
        })
    }

    /**
     * 给 menu 设置 panel
     * @param panel panel 实例
     */
    protected setPanel(panel: Panel): void {
        this.panel = panel
    }

    /**
     * 菜单点击事件
     * @param e event
     */
    protected clickHandler(e: Event): void {}
}

export default PanelMenu
