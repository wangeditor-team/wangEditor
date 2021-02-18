/**
 * @author 翠林
 * @deprecated 监听数据
 *
 * 整体逻辑：
 *  视图改变数据：鼠标拖拽 => 更新滑块定位 => 更新 hsva 的值 => 更新 rgb 的值 => 更新预览色块和输出框的值
 *  数据改变视图：输入框变化 => 更新 rgba 的值和预览色块 => 更新 hsv 的值 => 更新滑块定位
 */

import { colorRegex } from '../../../../utils/const'
import Palette from '..'
import { HSVToRGB } from '../../../../utils/color-conversion'
import define from '../../util/define'

export default function observe(palette: Palette) {
    const $refs = palette.$el.$refs()

    function hsvaChange() {
        palette.forward && palette.hsvToRgb()
    }

    /**
     * 色度 - 定位
     */
    define(palette.data, 'h', function (value: number) {
        // 滑块定位
        $refs.hue.css('top', `${value}px`)
        // 更新饱和度和纯度的面板视图
        const { r, g, b } = HSVToRGB((value / palette.data.mh) * 360, 100, 100)
        $refs.bg.css('background', `rgb(${r}, ${g}, ${b})`)
        hsvaChange()
    })

    /**
     * 饱和度 - 定位
     */
    define(palette.data, 's', function (value: number) {
        // 滑块定位
        $refs.sv.css('left', `${value}px`)
        hsvaChange()
    })

    /**
     * 纯度 - 定位
     */
    define(palette.data, 'v', function (value: number) {
        // 滑块定位
        $refs.sv.css('top', `${palette.data.mv - value}px`)
        hsvaChange()
    })

    /**
     * 滑块定位 - 透明度
     */
    define(palette.data, 'a', function (value: number) {
        $refs.alpha.css('left', `${value}px`)
        hsvaChange()
        palette.createValue()
    })

    /**
     * 将值限定在 0 ~ max 之间
     * @param value 需要被过滤的值（值的范围限定在 -1 ~ max；-1 ~ 0 表示传入的百分比；0 ~ max 表示传入的最终值）
     * @param max 最大值
     */
    function between(value: number, max: number) {
        if (value >= -1) {
            if (value < 0) {
                value = Math.abs(value * max)
            }
            value = parseFloat(value.toFixed(1))
            if (value > max) {
                value = max
            }
            return {
                valid: true,
                data: value,
            }
        } else {
            return {
                valid: false,
                data: value,
            }
        }
    }

    function rgbChange() {
        palette.forward
            ? palette.createValue() // 生成输出框的值
            : palette.rgbToHsv() // rgb 转 hsv
    }

    /**
     * RGBA - R
     */
    define(palette.data, 'r', rgbChange, function (value: number) {
        return between(value, 255)
    })

    /**
     * RGBA - G
     */
    define(palette.data, 'g', rgbChange, function (value: number) {
        return between(value, 255)
    })

    /**
     * RGBA - B
     */
    define(palette.data, 'b', rgbChange, function (value: number) {
        return between(value, 255)
    })

    /**
     * 模式切换
     */
    define(palette.data, 'pattern', function (value: string) {
        if (palette.forward) {
            // 生成新模式下的输出框值
            palette.createValue()
        }
        // 更新视图中模式切换文字信息
        $refs.pattern.text(value.toUpperCase())
    }, function (value: string) {
        return {
            valid: palette.pattern.indexOf(value) !== -1,
            data: value,
        }
    })

    /**
     * value
     */
    define(palette.data, 'value', function (value: string) {
        if (palette.forward) {
            // 更新输入框
            ;($refs.input.elems[0] as HTMLInputElement).value = value
        }
        // 更新预览色块
        $refs.preview.css('background-color', value)
        palette.picker.config.change(value)
    }, function (value: string) {
        return {
            valid: colorRegex.test(value),
            data: value.toLowerCase(),
        }
    })
}
