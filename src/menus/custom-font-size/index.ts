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
        selection.saveRange()
        // 获取当前选区的node
        const _childrenNode = selection.getRange()?.commonAncestorContainer.childNodes
        let isHasImg: Boolean = false
        // 遍历循环看有没有img标签
        _childrenNode?.forEach((el: ChildNode) => {
            if (el.nodeName === 'IMG') {
                isHasImg = true
            }
            !isHasImg &&
                el.childNodes.length > 0 &&
                el.childNodes.forEach((sonEl: ChildNode) => {
                    if (sonEl.nodeName === 'IMG') {
                        isHasImg = true
                    }
                })
        })
        if (isHasImg) {
            return
        }
        // 获取选区被选中的文字
        const text = selection.getSelectionText()
        // 获取父级的element
        const parentEle = selection.getRange()?.commonAncestorContainer.parentElement
        // 获取当前选择文字父级的标签的名字
        const parentNodename: string | undefined = parentEle?.nodeName
        // 获取当前fontsize大小
        const curFontzie: String | undefined = parentEle?.style?.fontSize
        // 需要插入的html
        let html = `<span style="font-size:${value}">${text}</span>`
        // 当他的父级的Nodename是span且有font-size大小时
        // 说明当前选中的文字的选区之前设置过字体大小
        if (parentNodename === 'SPAN' && curFontzie != '') {
            // 创建动态RegExp正则
            const regStrWithspan: string = `>${text}</span>`
            const regStrWithp: string = `>${text}</p>`
            const regWithspan: RegExp = new RegExp(regStrWithspan, 'g')
            const regWithp: RegExp = new RegExp(regStrWithp, 'g')
            // 获取当前编辑区html
            const editorhtml: string = editor.txt.html() as string
            // 如果匹配成功说明span标签包着的就是这个文字，直接给它的父级设置字体大小属性即可
            const regResWithspan: boolean = regWithspan.test(editorhtml)
            const regResWithp: boolean = regWithp.test(editorhtml)
            if (!selection.isSelectionEmpty() && text !== '' && text.length > 0) {
                // 获取父级的element直接设置font-size
                if (regResWithspan || regResWithp) {
                    parentEle?.setAttribute('style', `font-size:${value}`)
                } else {
                    editor.cmd.do(`insertElem`, $(html))
                }
            }
        } else {
            // Todo 待优化 insertHTML 导致dom重绘选区丢失问题 insertElem无法撤回
            if (!selection.isSelectionEmpty() && text !== '' && text.length > 0) {
                editor.cmd.do(`insertElem`, $(html))
            }
        }
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {}
}

export default customFontSize
