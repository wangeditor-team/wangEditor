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
        const _range = selection.getRange()
        // 获取选区被选中的文字
        const text = selection.getSelectionText()
        if (selection.isSelectionEmpty() || !text || text.length === 0 || text === ' ') {
            return
        }
        // 获取当前选区的node
        const _childrenNode = _range?.commonAncestorContainer.childNodes
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
        // 如果存在则不执行字体大小设置
        if (isHasImg) {
            return
        }

<<<<<<< HEAD
<<<<<<< HEAD
        // 获取选区被选中的文字
        const text = selection.getSelectionText()

        // 需要插入的html
        let html = `<span style="font-size:${value}">${text}</span>`

        // Todo 待优化 insertHTML 导致dom重绘选区丢失问题 insertElem无法撤回

        if (!selection.isSelectionEmpty()) {
=======
        // var data = _rang && selection.getSelectionContainerElem(_rang)?.childNodes
=======
        // var data = _range && selection.getSelectionContainerElem(_range)?.childNodes
>>>>>>> 6653df6... fix：修复插入的html外面是span的情况
        // console.log('data', data)
        // 获取父级的element
        const parentEle = _range?.commonAncestorContainer.parentElement
        // 获取当前选择文字父级的标签的名字
        const firstNodename: string | undefined = parentEle?.firstChild?.nodeName
        // 获取当前fontsize大小
        const pre: String | undefined = parentEle?.style?.fontSize
        // 需要插入的html
        let html = `<span style="font-size:${value}">${text}</span>`
        // 当他的父级的Nodename是span且有font-size大小时
        // 说明当前选中的文字的选区之前设置过字体大小
        // Todo 待优化 insertHTML 导致dom重绘选区丢失问题 insertElem无法撤回
        if (firstNodename === 'DIV') {
            editor.cmd.do(`insertElem`, $(`<p>${html}</p>`))
        } else if (firstNodename === 'SPAN') {
            // 创建动态RegExp正则
            const regStr: string = `>${text.trim()}</span>`
            const reg: RegExp = new RegExp(regStr, 'gi')
            // 获取当前编辑区html
            const editorhtml: string = editor.txt.html() as string
            // 如果匹配成功说明span标签包着的就是这个文字，直接给它的父级设置字体大小属性即可
            const regRes: boolean = reg.test(editorhtml.trim())
            // 获取父级的element直接设置font-size
            if (regRes) {
                parentEle?.setAttribute('style', `font-size:${value}`)
            } else {
                editor.cmd.do(`insertElem`, $(html))
            }
        } else if (firstNodename === 'P') {
            editor.cmd.do(`insertElem`, $(` <p>${html}</p>`))
        } else {
>>>>>>> d115c9a... fix：修复插入的html外面是span的情况
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
