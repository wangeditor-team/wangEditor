/**
 * @description menu entry
 * @author wangfupeng
 */

import ColorMenu from './ColorMenu'
import { getColors } from './config'

export function genMenuConf(mark: string, title: string, iconSvg: string) {
  return {
    key: mark,
    factory() {
      return new ColorMenu(mark, title, iconSvg)
    },

    // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
    // 用户也可以修改这个配置
    config: {
      colors: getColors(),
    },
  }
}
