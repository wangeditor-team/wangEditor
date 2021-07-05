/**
 * @description menu entry
 * @author wangfupeng
 */

import ColorMenu from './ColorMenu'
import BgColorMenu from './BgColorMenu'
import { genColors, genBgColors } from './config'

export const colorMenuConf = {
  key: 'color',
  factory() {
    return new ColorMenu()
  },

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
  config: {
    colors: genColors(),
  },
}

export const bgColorMenuConf = {
  key: 'bgColor',
  factory() {
    return new BgColorMenu()
  },
  config: {
    colors: genBgColors(),
  },
}
