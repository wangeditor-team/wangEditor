/**
 * @description 文字颜色 FontColor
 * @author lkw
 *
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'

class FontColor extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-pencil2"></i>
            </div>`
        )
        const colorListConf = {
            width: 120,
            title: '文字颜色',
            // droplist 内容以 block 形式展示
            type: 'inline-block',
            list: editor.config.colors.map(color => {
                return {
                    $elem: $(`<i style="color:${color};" class="w-e-icon-pencil2"></i>`),
                    value: color,
                }
            }),
            clickHandler: (value: string) => {
                // this 是指向当前的 BackColor 对象
                this.command(value)
            },
        }
        super($elem, editor, colorListConf)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const isEmptySelection = editor.selection.isSelectionEmpty()

        if (isEmptySelection) {
            // 插入空白选区
            editor.selection.createEmptyRange()
        }

        editor.cmd.do('foreColor', value)

        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange()
            editor.selection.restoreSelection()
        }
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {}
}

export default FontColor
