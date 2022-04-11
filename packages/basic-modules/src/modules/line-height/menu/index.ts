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

  // 默认的菜单菜单配置，将存储在 editorConfig.MENU_CONF[key] 中
  // 创建编辑器时，可通过 editorConfig.MENU_CONF[key] = {...} 来修改
  config: {
    lineHeightList: genLineHeightConfig(),
  },
}
