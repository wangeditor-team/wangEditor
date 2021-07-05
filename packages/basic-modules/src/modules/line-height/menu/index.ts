/**
 * @description line-height menu entry
 * @author wangfupeng
 */

import LineHeightMenu from './LineHeightMenu'
import { genLineHeightConfig } from './config'

export const lineHeightMenuConf = {
  key: 'lineHeight',
  factory() {
    return new LineHeightMenu()
  },

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
  config: {
    lineHeightList: genLineHeightConfig(),
  },
}
