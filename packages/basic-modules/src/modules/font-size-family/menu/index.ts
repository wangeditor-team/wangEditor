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

  // 默认的菜单菜单配置，将存储在 editor.getConfig().MENU_CONF[key] 中
  // 可以通过 editor.getMenuConfig(key) 获取，通过 editor.setMenuConfig(key, {...}) 修改
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
