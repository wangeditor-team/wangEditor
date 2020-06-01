/**
 * @description 下拉菜单 Class
 * @author wangfupeng
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import Menu from './Menu'
import DropList, { DropListConf } from './DropList'

class DropListMenu extends Menu {
    droplist: DropList

    constructor($elem: DomElement, editor: Editor, conf: DropListConf) {
        super($elem, editor)

        // 初始化 droplist
        const droplist = new DropList(this, conf)
        this.droplist = droplist

        // 绑定事件
        $elem
            .on('mouseenter', () => {
                if (editor.selection.getRange() == null) {
                    return
                }
                // 显示
                droplist.showTimeoutId = window.setTimeout(() => {
                    droplist.show()
                }, 200)
            })
            .on('mouseleave', () => {
                // 隐藏
                droplist.hideTimeoutId = window.setTimeout(() => {
                    droplist.hide()
                })
            })
    }
}

export default DropListMenu
