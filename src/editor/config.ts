/**
 * @description 编辑器配置
 * @author wangfupeng
 */

export type ConfigType = {
    menus: string[]
    fontNames: string[]
    colors: string[]
    zIndex: number
    onfocus: Function
    onblur: Function
}

const EMPTY_FN = () => {}

const defaultConfig = {
    // 默认菜单配置
    menus: ['bold', 'head', 'link'],

    fontNames: ['宋体', '微软雅黑', 'Arial', 'Tahoma', 'Verdana'],

    colors: [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf',
        '#c24f4a',
        '#8baa4a',
        '#7b5ba1',
        '#46acc8',
        '#f9963b',
        '#ffffff',
    ],

    zIndex: 10000,

    onfocus: EMPTY_FN,
    onblur: EMPTY_FN,
}

export default defaultConfig
