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

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config: {
    lineHeightList: genLineHeightConfig(),
  },
}
