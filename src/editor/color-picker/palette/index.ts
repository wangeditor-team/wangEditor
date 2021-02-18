/**
 * @author 翠林
 * @deprecated 调色板
 */

import ColorPicker from '..'
import { Data } from '../types'
import { HEXToRGBA, HSVToRGB, RGBAToHEX, RGBToHSV } from '../../../utils/color-conversion'
import $, { DomElement } from './../../../utils/dom-core'
import { hexRegex, rgbRegex } from '../../../utils/const'
import observe from './render/observe'
import bindEvent from './render/event'
import tpl from './render/view'

/**
 * 调色板
 */
export default class Palette {
    /**
     * 调色板的根节点
     */
    public $el: DomElement

    /**
     * 支持输入的颜色类型
     */
    public pattern = ['rgb', 'hex']

    /**
     * 调色板的数据
     */
    public data: Data = {
        /**
         * h 滑块定位的最大值
         */
        mh: 180,
        /**
         * s 滑块定位的最大值
         */
        ms: 240,
        /**
         * v 滑块定位的最大值
         */
        mv: 180,
        /**
         * a 滑块定位的最大值
         */
        ma: 257,
        /**
         * hsva 滑块中 h 滑块的定位，非 h 相对应的颜色值。要获取 hsva 颜色中 h 的值，需要与 mh 一起计算获得
         */
        h: 0,
        /**
         * hsva 滑块中 s 滑块的定位，非 s 相对应的颜色值。要获取 hsva 颜色中 s 的值，需要与 ms 一起计算获得
         */
        s: 240,
        /**
         * hsva 滑块中 v 滑块的定位，非 v 相对应的颜色值。要获取 hsva 颜色中 v 的值，需要与 mv 一起计算获得
         */
        v: 180,
        /**
         * hsva 滑块中 a 滑块的定位，非 a 相对应的颜色值。要获取 hsva 颜色中 a 的值，需要与 ma 一起计算获得
         */
        a: 257,
        /**
         * rgb 颜色的 r 值
         */
        r: 255,
        /**
         * rgb 颜色的 g 值
         */
        g: 0,
        /**
         * rgb 颜色的 b 值
         */
        b: 0,
        /**
         * 当前输出颜色值的类型
         */
        pattern: 'rgb',
        /**
         * 用于输出的值，这个值的类型由 pattern 决定
         */
        value: '',
    }

    /**
     * 当前数据变化的模式：
     *  true：视图改变数据（鼠标拖拽 => 更新滑块定位 => 更新 hsva 的值 => 更新 rgb 的值 => 更新预览色块和输出框的值）
     *  false：数据改变视图（输入框变化 => 更新 rgba 的值和预览色块 => 更新 hsv 的值 => 更新滑块定位）
     */
    public forward = true

    public picker: ColorPicker

    public constructor(picker: ColorPicker) {
        this.picker = picker
        this.$el = $('<div></div>')
    }

    /**
     * 渲染
     */
    public render() {
        this.$el = $(tpl(this.picker.config))
        bindEvent(this)
        observe(this)
        this.data.value = 'rgb(255, 0, 0)'
        // RGB 在 font 标签上的支持很差，我们这里禁用 RGB 颜色的设置
        if (!this.picker.config.rgb) {
            this.pattern = ['hex']
            this.data.pattern = 'hex'
        }
    }

    /**
     * 生成颜色最终值
     */
    public createValue() {
        const { r, g, b, a, ma } = this.data
        const av = parseFloat((a / ma).toFixed(2))
        switch (this.data.pattern) {
            case 'hex':
                this.data.value = RGBAToHEX(r, g, b, av)
                break
            default:
                this.data.value =
                    av === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${av})`
                break
        }
    }

    /**
     * 分析颜色值
     * @param value 用户输入的值
     */
    public analyseValue(value: string) {
        this.forward = false
        // 分析用户的输入
        if (hexRegex.test(value)) {
            this.data.value = value
            this.data.pattern = 'hex'
            const { r, g, b, a } = HEXToRGBA(value)
            this.data.r = r
            this.data.g = g
            this.data.b = b
            this.data.a = a * this.data.ma
            this.data.value = value
        } else if (rgbRegex.test(value)) {
            const rgba = value.match(/\d+(\.\d+)?/g)
            if (rgba && rgba.length > 2) {
                this.data.pattern = 'rgb'
                const [r, g, b, a] = rgba.map(n => parseFloat(n))
                this.data.r = r
                this.data.g = g
                this.data.b = b
                this.data.a = (typeof a === 'number' ? a : 1) * this.data.ma
                this.data.value = value
            }
        }
    }

    /**
     * 将 hsv 定位转换为 rgb 颜色值
     */
    public hsvToRgb() {
        const { h, s, v, mh, ms, mv } = this.data
        const { r, g, b } = HSVToRGB((h / mh) * 360, (s / ms) * 100, (v / mv) * 100)
        this.data.r = r
        this.data.g = g
        this.data.b = b
    }

    /**
     * 将 rgb 颜色值转换为 hsv 定位值
     */
    public rgbToHsv() {
        const { h, s, v } = RGBToHSV(this.data.r, this.data.g, this.data.b)
        this.data.h = (h / 360) * this.data.mh
        this.data.s = (s / 100) * this.data.ms
        this.data.v = (v / 100) * this.data.mv
    }

    /**
     * 显示调色板
     */
    public show() {
        this.picker.$el.append(this.$el)
    }

    /**
     * 隐藏调色板
     */
    public hide() {
        this.$el.remove()
    }
}
