/**
 * @author 翠林
 * @deprecated 颜色选择器。分为【颜色列表】和【调色板】两部分。
 */

import '../../assets/style/color-picker.less'
import { Config, UserConfig } from './types'
import { colorRegex, EMPTY_FN } from '../../utils/const'
import Select from './select'
import Palette from './palette'
import $, { DomElement } from '../../utils/dom-core'

export default class ColorPicker {
    public $el: DomElement
    /**
     * 颜色列表
     */
    public select: Select

    /**
     * 调色板
     */
    public palette: Palette

    constructor() {
        this.$el = $(`<div class="we-color-picker"></div>`)
        this.select = new Select(this)
        this.palette = new Palette(this)
    }

    /**
     * 二次封装 space
     */
    public get space() {
        return `wecph-${this.config.space}`
    }

    /**
     * 获取【最近使用的颜色】
     */
    public get history(): string[] {
        const history = localStorage.getItem(this.space)
        if (history && /^\[.*\]$/.test(history)) {
            return JSON.parse(history)
        }
        return []
    }

    /**
     * 保存【最近使用的颜色】
     */
    public set history(value: string[]) {
        localStorage.setItem(this.space, JSON.stringify(value.slice(0, 20)))
    }

    /**
     * 将某一个颜色值保存到【最近使用的颜色】
     * @param value color 值
     */
    public record(value: string) {
        if (this.config.history) {
            value = value.toLowerCase()
            if (colorRegex.test(value)) {
                const history = this.history
                const index = history.indexOf(value)
                if (index > -1) {
                    history.splice(index, 1)
                }
                history.unshift(value)
                this.history = history
            }
        }
    }

    /**
     * 配置
     */
    public config: Config = {
        rgb: true,
        space: 'wecph',
        alpha: true,
        builtIn: true,
        builtInTitle: '内置颜色列表',
        history: true,
        historyTitle: '最近使用的颜色',
        custom: [],
        customTitle: '自定义颜色列表',
        text: {
            toSelect: '颜色列表',
            toPalette: '调色板',
            done: '确定',
            cancel: '取消',
            empty: '无',
        },
        append: document.body,
        closed: EMPTY_FN,
        done: EMPTY_FN,
        cancel: EMPTY_FN,
        change: EMPTY_FN,
    }

    /**
     * 快捷创建颜色选择器
     * @param config 配置项
     */
    public static create(config: UserConfig) {
        const instance = new ColorPicker()

        Object.assign(instance.config, config)

        instance.render()

        return instance
    }

    /**
     * 渲染
     */
    public render() {
        this.$el.on('click', function (e: Event) {
            e.stopPropagation()
        })
        $(this.config.append).append(this.$el)
        this.select.render()
        this.palette.render()
    }

    css(key: string, value: string | number) {
        this.$el.css(key, value)
        return this
    }

    /**
     * 打开颜色选择器
     */
    public show() {
        this.select.updateHistoryList().show()
        this.palette.hide()
    }

    /**
     * 关闭颜色选择器
     */
    public hide() {
        this.select.hide()
        this.palette.hide()
        this.config.closed(this)
    }
}
