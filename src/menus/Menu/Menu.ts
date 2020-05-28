/**
 * @description Menu class 父类
 * @author wangfupeng
 */

import { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'

class Menu {
    $elem: DomElement
    editor: Editor
    _active: boolean // 菜单是否处于激活状态，如选中一段加粗文字时，bold 菜单要被激活（即高亮显示）

    constructor($elem: DomElement, editor: Editor) {
        this.$elem = $elem
        this.editor = editor
        this._active = false
    }

    /**
     * 尝试修改菜单的激活状态，各个 menu 自己去实现
     */
    public tryChangeActive(): void {}

    /**
     * 激活菜单，高亮显示
     */
    protected active(): void {
        this._active = true
        this.$elem.addClass('w-e-active')
    }

    /**
     * 取消激活，不再高亮显示
     */
    protected unActive(): void {
        this._active = false
        this.$elem.removeClass('w-e-active')
    }
}

export default Menu
