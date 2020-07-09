/**
 * @description 字号 FontSize
 * @author lkw
 *
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import FontSizeList from './FontSizeList'

class FontSize extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-text-heigh"></i>
            </div>`
        )
        let fontStyleList = new FontSizeList(editor.config.fontSizes)
        const fontListConf = {
            width: 160,
            title: '设置字号',
            type: 'list',
            list: fontStyleList.getItemList(),
            clickHandler: (value: string) => {
                // this 是指向当前的 FontSize 对象
                this.command(value)
            },
        }
        super($elem, editor, fontListConf)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        editor.cmd.do('fontSize', value)
    }

    /**
     * 尝试修改菜单激活状态
     * ?字号是否需要有激活状态这个操作?
     */
    public tryChangeActive(): void {}
}

export default FontSize
