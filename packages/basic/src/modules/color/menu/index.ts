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
  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
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
