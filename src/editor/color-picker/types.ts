/**
 * 类型定义
 */

import ColorPicker from '.'
import { DomElementSelector } from '../../utils/dom-core'

export interface Data {
    [propName: string]: any
}

/**
 * 按钮的文字
 */
export interface Text {
    /** 切换至【颜色列表】按钮的文字 */
    toSelect: string
    /** 切换至【调色板】按钮的文字 */
    toPalette: string
    /** 调色板【确定】按钮的文字 */
    done: string
    /** 调色板【取消】按钮的文字 */
    cancel: string
    /** 【最近使用的颜色】没有内容时的提示语 */
    empty: string
}

export type ColorGroup = string[]

/**
 * 颜色集合
 */
export type ColorData = ColorGroup | ColorGroup[]

/**
 * 颜色选择器的配置项
 */
export interface Config {
    /**
     * 调色板允许使用 RGB 颜色
     */
    rgb: boolean
    /**
     * 本次实例的命名空间
     */
    space: string
    /**
     * 调色板是否支持透明度选择
     */
    alpha: boolean
    /**
     * 显示内置颜色列表
     */
    builtIn: boolean
    /**
     * 内置颜色列表的 Title
     */
    builtInTitle: string
    /**
     * 显示最近使用的颜色
     */
    history: boolean
    /**
     * 最近使用的颜色的 Title
     */
    historyTitle: string
    /**
     * 用户自定义颜色列表
     */
    custom: ColorData
    /**
     * 自定义颜色列表 Title
     */
    customTitle: string
    /**
     * 关键节点的文本
     */
    text: Text
    /**
     * 颜色选择器的父容器
     */
    append: DomElementSelector
    /**
     * 颜色选择器关闭的回调
     */
    closed: (picker: ColorPicker) => void
    /**
     * 确认选择某一颜色的回调
     */
    done: (color: string) => void
    /**
     * 未选色而关闭选择器的回调
     */
    cancel: (picker: ColorPicker) => void
    /**
     * 调色板颜色变化的回调
     */
    change: (color: string) => void
}

/**
 * 供用户配置的配置项
 */
export interface UserConfig {
    /**
     * 调色板允许使用 RGB 颜色
     */
    rgb?: boolean
    /**
     * 本次实例的命名空间
     */
    space?: string
    /**
     * 调色板是否支持透明度选择
     */
    alpha?: boolean
    /**
     * 显示内置颜色列表
     */
    builtIn?: boolean
    /**
     * 内置颜色列表的 Title
     */
    builtInTitle?: string
    /**
     * 显示最近使用的颜色
     */
    history?: boolean
    /**
     * 最近使用的颜色的 Title
     */
    historyTitle?: string
    /**
     * 用户自定义颜色列表
     */
    custom?: ColorData
    /**
     * 自定义颜色列表 Title
     */
    customTitle?: string
    /**
     * 关键节点的文本
     */
    text?: Text
    /**
     * 颜色选择器的父容器
     */
    append?: DomElementSelector
    /**
     * 颜色选择器关闭的回调
     */
    closed?: (picker: ColorPicker) => void
    /**
     * 确认选择某一颜色的回调
     */
    done?: (color: string) => void
    /**
     * 未选色而关闭选择器的回调
     */
    cancel?: (picker: ColorPicker) => void
    /**
     * 调色板颜色变化的回调
     */
    change?: (color: string) => void
}
