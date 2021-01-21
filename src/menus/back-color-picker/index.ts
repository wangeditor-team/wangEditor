/**
 * @author 翠林
 * @deprecated 支持调色板的背景色菜单
 */

import Editor from '../../editor'
import $ from '../../utils/dom-core'
import { hexToRgb } from '../../utils/util'
import ColorPickerMenu from '../menu-constructors/ColorPickerMenu'

export default class BackColorPicker extends ColorPickerMenu {
    public constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="背景颜色">
                <i class="w-e-icon-paint-brush"></i>
            </div>`
        )
        const config = {
            space: 'back',
            done: (color: string) => {
                this.command(color)
            },
        }
        super($elem, editor, config)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        const editor = this.editor
        const isEmptySelection = editor.selection.isSelectionEmpty()
        const $selectionElem = editor.selection.getSelectionContainerElem()?.elems[0]

        if ($selectionElem == null) return

        const isSpan = $selectionElem?.nodeName.toLowerCase() !== 'p'
        const bgColor = $selectionElem?.style.backgroundColor
        const isSameColor = hexToRgb(value) === bgColor

        if (isEmptySelection) {
            if (isSpan && !isSameColor) {
                const $elems = editor.selection.getSelectionRangeTopNodes()
                editor.selection.createRangeByElem($elems[0])
                editor.selection.moveCursor($elems[0].elems[0])
            }
            // 插入空白选区
            editor.selection.createEmptyRange()
        }

        editor.cmd.do('backColor', value)

        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange()
            editor.selection.restoreSelection()
        }
    }

    public tryChangeActive() {}
}
