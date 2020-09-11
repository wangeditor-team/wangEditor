/**
 * @description 下拉菜单 Class
 * @author wangfupeng
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import Menu from './Menu'
import DropList, { DropListConf } from './DropList'

class DropListMenu extends Menu {
    public dropList: DropList

    constructor($elem: DomElement, editor: Editor, conf: DropListConf) {
        super($elem, editor)

        // 国际化
        conf.title = editor.i18next.t(`menus.dropListMenu.${conf.title}`)

        // 初始化 dropList
        const dropList = new DropList(this, conf)
        this.dropList = dropList

        // 绑定事件
        $elem
            .on('mouseenter', () => {
                if (editor.selection.getRange() == null) {
                    return
                }
                $elem.css('z-index', editor.config.zIndex + 2)
                // 触发 droplist 悬浮事件
                editor.txt.eventHooks.menuHoverEvents.forEach(fn => fn())
                // 显示
                dropList.showTimeoutId = window.setTimeout(() => {
                    dropList.show()
                }, 200)
            })
            .on('mouseleave', () => {
                $elem.css('z-index', editor.config.zIndex + 1)
                // 隐藏
                dropList.hideTimeoutId = window.setTimeout(() => {
                    dropList.hide()
                })
            })
    }
}

export default DropListMenu
