/**
 * @description 段落行高 LineHeight
 * @author lichunlin
 *
 */

import DropListMenu from '../menu-constructors/DropListMenu'
import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import lineHeightList from './lineHeightList'
import { UA } from '../../utils/util'

class LineHeight extends DropListMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="行高">
                    <i class="w-e-icon-row-height"></i>
                </div>`
        )
        let lineHeightMenu = new lineHeightList(editor, editor.config.lineHeights)
        const DropListMenu = {
            width: 100,
            title: '设置行高',
            type: 'list', // droplist 以列表形式展示
            list: lineHeightMenu.getItemList(),
            clickHandler: (value: string) => {
                //保存焦点
                editor.selection.saveRange()
                this.command(value)
            },
        }

        super($elem, editor, DropListMenu)
    }

    /**
     * 执行命令
     * @param value value
     */
    public command(value: string): void {
        let selection = window.getSelection ? window.getSelection() : document.getSelection()
        //允许设置dom
        const allowArray: string[] = ['P']
        const editor = this.editor
        let st: string = ''
        //恢复焦点
        editor.selection.restoreSelection()
        const $selectionElem = $(editor.selection.getSelectionContainerElem())

        if (!$selectionElem?.length) return

        const $selectionAll = $(editor.selection.getSelectionContainerElem())
        // let dom:HTMLElement= $selectionElem.elems[0]
        let dom: HTMLElement = $(editor.selection.getSelectionStartElem()).elems[0]
        //获取元素的style
        let style: string | null = ''
        let styleList: string[] = []
        //点击默认的时候删除line-height属性 并重新设置 style
        let styleStr: string = ''

        //选中多行操作
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            let isIE = UA.isIE()
            if (isIE) {
                // ie下禁止多行操作 避免多行造成除第一行外的段落内容都被删除
                return
            }
            //获取range 开头结束的dom在 祖父元素的下标
            let indexStore: Array<number> = []
            let arrayDom_a: Array<HTMLElement> = []
            let arrayDom_b: Array<HTMLElement> = []
            //获取range 开头结束的dom
            const StartElem: DomElement = $(editor.selection.getSelectionStartElem())
            const EndElem: DomElement = $(editor.selection.getSelectionEndElem())
            const childList: NodeListOf<ChildNode> | undefined = editor.selection.getRange()
                ?.commonAncestorContainer.childNodes
            arrayDom_a.push(this.getDom(StartElem.elems[0]))
            childList?.forEach((item, index) => {
                if (item === this.getDom(StartElem.elems[0])) {
                    indexStore.push(index)
                }
                if (item === this.getDom(EndElem.elems[0])) {
                    indexStore.push(index)
                }
            })
            //遍历 获取头尾之间的dom元素
            let i = 0
            let d: HTMLElement
            arrayDom_b.push(this.getDom(StartElem.elems[0]))
            while (arrayDom_a[i] !== this.getDom(EndElem.elems[0])) {
                d = $(arrayDom_a[i].nextElementSibling).elems[0]
                if (allowArray.indexOf($(d).getNodeName()) !== -1) {
                    arrayDom_b.push(d)
                    arrayDom_a.push(d)
                } else {
                    arrayDom_a.push(d)
                }
                i++
            }

            //设置段落选取 全选
            if ($(arrayDom_a[0]).getNodeName() !== 'P') {
                i = 0
                //遍历集合得到第一个p标签的下标
                for (var k = 0; k < arrayDom_a.length; k++) {
                    if ($(arrayDom_a[k]).getNodeName() === 'P') {
                        i = k
                        break
                    }
                }
                //i===0 说明选区中没有p段落
                if (i === 0) {
                    return
                }
                let _i = 0
                while (_i !== i) {
                    arrayDom_a.shift()
                    _i++
                }
            }
            //设置替换的选区
            this.setRange(arrayDom_a[0], arrayDom_a[arrayDom_a.length - 1])
            //生成innerHtml html字符串
            arrayDom_a.forEach(item => {
                style = item.getAttribute('style')
                styleList = style ? style.split(';') : []
                styleStr = ''
                if ($(item).getNodeName() === 'P') {
                    //判断是否 点击默认
                    value
                        ? (styleStr = this.styleProcessing(styleList) + `line-height:${value};`)
                        : (styleStr = this.styleProcessing(styleList))
                    st =
                        st +
                        `<${$(item).getNodeName().toLowerCase()} style="${styleStr}">${
                            item.innerHTML
                        }</${$(item).getNodeName().toLowerCase()}>`
                } else {
                    styleStr = this.styleProcessing(styleList)
                    st =
                        st +
                        `<${$(item).getNodeName().toLowerCase()} style="${styleStr}">${
                            item.innerHTML
                        }</${$(item).getNodeName().toLowerCase()}>`
                }
            })
            this.action(st, editor)

            //恢复已选择的选区
            dom = $selectionAll.elems[0]
            this.setRange(dom.children[indexStore[0]], dom.children[indexStore[1]])
            return
        }

        //遍历dom 获取祖父元素 直到contenteditable属性的div标签
        dom = this.getDom(dom)

        //校验允许lineheight设置标签
        if (allowArray.indexOf($(dom).getNodeName()) === -1) {
            return
        }
        style = dom.getAttribute('style')
        styleList = style ? style.split(';') : []
        //全选 dom下所有的内容
        selection?.selectAllChildren(dom)
        //保存range
        editor.selection.saveRange()
        //判断是否存在value 默认 移除line-height
        if (!value) {
            if (style) {
                styleStr = this.styleProcessing(styleList)
                //避免没有其它属性 只留下 ‘style’ 减少代码
                if (styleStr === '') {
                    st = `<${$(dom).getNodeName().toLowerCase()}>${dom.innerHTML}</${$(dom)
                        .getNodeName()
                        .toLowerCase()}>`
                } else {
                    st = `<${$(dom).getNodeName().toLowerCase()} style="${styleStr}">${
                        dom.innerHTML
                    }</${$(dom).getNodeName().toLowerCase()}>`
                }
                this.action(st, editor)
            }
            return
        }
        if (style) {
            //存在style 检索其它style属性
            styleStr = this.styleProcessing(styleList) + `line-height:${value};`
        } else {
            styleStr = `line-height:${value};`
        }
        st = `<${$(dom).getNodeName().toLowerCase()} style="${styleStr}">${dom.innerHTML}</${$(dom)
            .getNodeName()
            .toLowerCase()}>`

        //防止BLOCKQUOTE叠加
        if ($(dom).getNodeName() === 'BLOCKQUOTE') {
            $(dom).css('line-height', value)
        } else {
            this.action(st, editor)
        }
    }

    /**
     * 遍历dom 获取祖父元素 直到contenteditable属性的div标签
     *
     */
    public getDom(dom: HTMLElement): HTMLElement {
        let DOM: HTMLElement = $(dom).elems[0]
        if (!DOM.parentNode) {
            return DOM
        }
        function getParentNode($node: HTMLElement, editor: Editor): HTMLElement {
            const $parent = $($node.parentNode)
            if (editor.$textElem.equal($parent)) {
                return $node
            } else {
                return getParentNode($parent.elems[0], editor)
            }
        }
        DOM = getParentNode(DOM, this.editor)

        return DOM
    }

    /**
     * 执行 document.execCommand
     *
     */
    public action(html_str: string, editor: Editor): void {
        editor.cmd.do('insertHTML', html_str)
    }

    /**
     * style 处理
     */
    public styleProcessing(styleList: Array<string>): string {
        let styleStr = ''
        styleList.forEach(item => {
            item !== '' && item.indexOf('line-height') === -1
                ? (styleStr = styleStr + item + ';')
                : ''
        })
        return styleStr
    }

    /**
     * 段落全选 比如：避免11变成111
     */
    public setRange(startDom: Node, endDom: Node): void {
        const editor = this.editor
        let selection = window.getSelection ? window.getSelection() : document.getSelection()
        //清除所有的选区
        selection?.removeAllRanges()
        const range = document.createRange()
        let star = startDom
        let end = endDom
        range.setStart(star, 0)
        range.setEnd(end, 1)
        selection?.addRange(range)
        //保存设置好的选区
        editor.selection.saveRange()
        //清除所有的选区
        selection?.removeAllRanges()
        //恢复选区
        editor.selection.restoreSelection()
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {
        const editor = this.editor
        const $selectionElem = editor.selection.getSelectionContainerElem()
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            //避免选中多行设置
            return
        }
        let dom: DomElement | HTMLElement = $(editor.selection.getSelectionStartElem())
        // 有些情况下 dom 可能为空，比如编辑器初始化
        if (dom.length === 0) return

        dom = this.getDom(dom.elems[0])
        let style: string | null = dom.getAttribute('style') ? dom.getAttribute('style') : ''

        //判断当前标签是否具有line-height属性
        if (style && style.indexOf('line-height') !== -1) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default LineHeight
