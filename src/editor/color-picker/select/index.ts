/**
 * @author 翠林
 * @deprecated 颜色列表
 */

import ColorPicker from '..'
import $, { DomElement } from '../../../utils/dom-core'
import builtInColor from './render/build-in-color'
import colorTPL, { colorGroupTPL, emptyGroupTPL } from './render/view'

export default class Select {
    /**
     * 颜色列表的根节点
     */
    public $el: DomElement

    public picker: ColorPicker

    public constructor(picker: ColorPicker) {
        this.picker = picker
        // 颜色列表的根节点
        this.$el = $(`<div class="we-selections"></div>`)
        // 绑定列表颜色选择
        this.$el.on('click', 'i[color]', function (e: MouseEvent) {
            const color = (e.target as Element).getAttribute('color')
            if (color) {
                picker.hide()
                picker.record(color)
                picker.config.done(color)
                picker.config.closed(picker)
            }
        })
    }

    /**
     * 渲染颜色列表
     */
    public render() {
        const doms = []
        const config = this.picker.config
        // 内置颜色列表
        if (config.builtIn) {
            doms.push(colorTPL(builtInColor, config.builtInTitle, config.text.empty))
        }
        // 用户自定义颜色列表
        if (config.custom.length) {
            doms.push(colorTPL(config.custom, config.customTitle, config.text.empty))
        }
        // 最近使用的颜色列表
        if (config.history) {
            doms.push(
                colorTPL(this.picker.history, config.historyTitle, config.text.empty).replace(
                    'class="we-selection-main"',
                    'class="we-selection-main" ref="history"'
                )
            )
        }
        // 切换到调色板按钮
        doms.push(`
        <div class="we-footer-btns">
            <div class="btn" ref="cancel">${config.text.cancel}</div>
            <div class="btn" ref="switchover">${config.text.toPalette}</div>
        </div>`)

        this.$el.html(doms.join(''))

        // 事件绑定 - 切换至调色板
        this.$el.$ref('switchover').on('click', (e: Event) => {
            this.hide()
            this.picker.palette.show()
        })

        // 事件绑定 - 取消
        this.$el.$ref('cancel').on('click', () => {
            this.picker.hide()
            this.picker.config.cancel(this.picker)
            this.picker.config.closed(this.picker)
        })
    }

    /**
     * 更新历史颜色列表
     */
    public updateHistoryList() {
        if (this.picker.config.history) {
            const color = this.picker.history
            const html = color.length
                ? colorGroupTPL(color)
                : emptyGroupTPL(this.picker.config.text.empty)
            this.$el.$ref('history').html(html)
        }
        return this
    }

    /**
     * 显示颜色列表
     */
    public show() {
        this.picker.$el.append(this.$el)
        return this
    }

    /**
     * 隐藏颜色列表
     */
    public hide() {
        this.$el.remove()
        return this
    }
}
