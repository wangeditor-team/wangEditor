/**
 * @description font-size font-family menu entry
 * @author wangfupeng
 */

import FontSizeMenu from './FontSizeMenu'
import FontFamilyMenu from './FontFamilyMenu'
import { genFontSizeConfig, getFontFamilyConfig } from './config'

export const fontSizeMenuConf = {
  key: 'fontSize',
  factory() {
    return new FontSizeMenu()
  },

  // 默认的菜单菜单配置，可以通过 editor.getConfig().menuConf[key] 拿到
  // 用户也可以修改这个配置
  config: {
    fontSizeList: genFontSizeConfig(),
  },
}

export const fontFamilyMenuConf = {
  key: 'fontFamily',
  factory() {
    return new FontFamilyMenu()
  },
  config: {
    fontFamilyList: getFontFamilyConfig(),
  },
}
