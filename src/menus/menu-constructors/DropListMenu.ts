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

        // 初始化 dropList
        const dropList = new DropList(this, conf)
        this.dropList = dropList

        // 绑定事件
        $elem
            .on('mouseenter', () => {
                if (editor.selection.getRange() == null) {
                    return
                }
                // 显示
                dropList.showTimeoutId = window.setTimeout(() => {
                    dropList.show()
                }, 200)
            })
            .on('mouseleave', () => {
                // 隐藏
                dropList.hideTimeoutId = window.setTimeout(() => {
                    dropList.hide()
                })
            })
    }
}

export default DropListMenu
