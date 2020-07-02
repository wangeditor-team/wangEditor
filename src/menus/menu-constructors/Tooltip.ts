/**
 * @description Tooltip class
 * @author wangfupeng
 */

import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'

type PositionDataType = {
    top: number
    left: number
}

type TooltipConfItemType = {
    $elem: DomElement
    onClick: Function
}
export type TooltipConfType = Array<TooltipConfItemType>

class Tooltip {
    private $container: DomElement
    private $targetElem: DomElement
    private editor: Editor
    private conf: TooltipConfType
    private _show: boolean

    constructor(editor: Editor, $elem: DomElement, conf: TooltipConfType) {
        this.editor = editor
        this.$targetElem = $elem
        this.conf = conf
        this._show = false

        // 定义 container
        const $container = $('<div></div>')
        $container.addClass('w-e-tooltip')
        this.$container = $container
    }

    /**
     * 获取 tooltip 定位
     */
    private getPositionData(): PositionDataType {
        const $container = this.$container

        let top = 0
        let left = 0

        // tooltip 的高度
        const tooltipHeight = 20
        // 网页的 scrollTop
        const pageScrollTop = document.documentElement.scrollTop
        // 目标元素的 rect
        const targetElemRect = this.$targetElem.getBoundingClientRect()
        // 编辑区域的 rect
        const textElemRect = this.editor.$textElem.getBoundingClientRect()

        // 计算 top
        if (targetElemRect.top < tooltipHeight) {
            // 说明目标元素的顶部，因滑动隐藏在浏览器上方。tooltip 要放在目标元素下面
            top = targetElemRect.bottom + pageScrollTop + 5 // 5px 间距
            $container.addClass('w-e-tooltip-down')
        } else if (targetElemRect.top - textElemRect.top < tooltipHeight) {
            // 说明目标元素的顶部，因滑动隐藏在编辑区域上方。tooltip 要放在目标元素下面
            top = targetElemRect.bottom + pageScrollTop + 5 // 5px 间距
            $container.addClass('w-e-tooltip-down')
        } else {
            // 其他情况，tooltip 放在目标元素上方
            top = targetElemRect.top + pageScrollTop - tooltipHeight - 15 // 减去 toolbar 的高度，还有 15px 间距
            $container.addClass('w-e-tooltip-up')
        }

        // 计算 left
        if (targetElemRect.left < 0) {
            left = 0
        } else {
            left = targetElemRect.left
        }

        // 返回结果
        return { top, left }
    }

    /**
     * 添加 tooltip 菜单
     */
    private appendMenus(): void {
        const conf = this.conf
        const editor = this.editor
        const $targetElem = this.$targetElem
        const $container = this.$container

        const length = conf.length
        conf.forEach((item: TooltipConfItemType, index: number) => {
            // 添加元素
            const $elem = item.$elem
            const $wrapper = $('<div></div>')
            $wrapper.addClass('w-e-tooltip-item-wrapper ')
            $wrapper.append($elem)
            $container.append($wrapper)

            // 绑定点击事件
            $elem.on('click', (e: Event) => {
                e.preventDefault()
                const res = item.onClick(editor, $targetElem)
                if (res) this.remove()
            })
        })
    }

    /**
     * 创建 tooltip
     */
    public create(): void {
        const editor = this.editor
        const $container = this.$container

        // 生成 container 的内容
        this.appendMenus()

        // 设置定位
        const { top, left } = this.getPositionData()
        $container.css('top', `${top}px`)
        $container.css('left', `${left}px`)

        // 设置 z-index
        $container.css('z-index', `${editor.config.zIndex + 1}`)

        // 添加到 DOM
        $('body').append($container)

        this._show = true
    }

    /**
     * 移除该 tooltip
     */
    public remove(): void {
        this.$container.remove()
        this._show = false
    }

    /**
     * 是否显示
     */
    public get isShow(): boolean {
        return this._show
    }
}

export default Tooltip
