/**
 * @description 编辑器配置
 * @author wangfupeng
 */

import menusConfig from './menus'
import eventsConfig from './events'
import styleConfig from './style'
import cmdConfig from './cmd'

// 定义配置项的类型规范
export type ConfigType = {
    menus: string[]
    fontNames: string[]
    colors: string[]
    zIndex: number
    onchange: Function
    onfocus: Function
    onblur: Function
    onchangeTimeout: number
    styleWithCSS: boolean
}

// 合并所有的配置信息
const defaultConfig = Object.assign({}, menusConfig, eventsConfig, styleConfig, cmdConfig)

export default defaultConfig
