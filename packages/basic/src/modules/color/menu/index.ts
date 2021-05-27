/**
 * @description menu entry
 * @author wangfupeng
 */

import ColorMenu from './ColorMenu'

function genColors() {
  return [
    '#000000',
    '#262626',
    '#595959',
    '#8c8c8c',
    '#bfbfbf',
    '#d9d9d9',
    '#e9e9e9e',
    '#f5f5f5',
    '#fafafa',
    '#ffffff', // 一行
    '#e13c39',
    '#e75f33',
    '#eb903a',
    '#f5db4d',
    '#72c040',
    '#59bfc0',
    '#4290f7',
    '#3658e2',
    '#6a39c9',
    '#d84493', // 一行
    '#fbe9e6',
    '#fcede1',
    '#fcefd4',
    '#fcfbcf',
    '#e7f6d5',
    '#daf4f0',
    '#d9edfa',
    '#e0e8fa',
    '#ede1f8',
    '#f6e2ea', // 一行
    // TODO 参考语雀编辑器，继续补充其他颜色
  ]
}

export function genMenuConf(mark: string, title: string, iconSvg: string) {
  return {
    key: mark,
    factory() {
      return new ColorMenu(mark, title, iconSvg)
    },

    // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
    // 用户也可以修改这个配置
    config: {
      colors: genColors(),
    },
  }
}
