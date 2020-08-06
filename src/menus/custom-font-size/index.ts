/**
 * @description 自定义字号
 * @author liuwei
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import { customFontSizeType } from '../../config/index'
import { DropListItem } from '../menu-constructors/DropList'

class customFontSize extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                <i class="w-e-icon-text-heigh"></i>
            </div>`
        )
        // 用户自定义的数据
        const customFontSizeData: customFontSizeType = editor.config.customFontSize

        // fontListConf list的数据结构
        const fontList: DropListItem[] = []

        // 遍历自定义数据对象
        for (let item of customFontSizeData) {
            if (!item.value.includes('rem') && !item.value.includes('px')) {
                throw new Error('自定义fontsize的key值非法！')
            }
            fontList.push({
                $elem: $(`<p>${item.text}</p>`),
                value: item.value,
            })
        }

        const fontListConf = {
            width: 120,
            title: '设置字号',
            type: 'list',
            list: fontList,
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
        const selection = editor.selection

        // 获取选区被选中的文字
        const text = selection.getSelectionText()

        // 需要插入的html
        let html = `<span style="font-size:${value}">${text}</span>`

        // Todo 待优化 insertHTML 导致dom重绘选区丢失问题 insertElem无法撤回

        if (!selection.isSelectionEmpty()) {
            editor.cmd.do(`insertElem`, $(html))
        }

        // editor.selection.restoreSelection()
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {}
}

export default customFontSize
