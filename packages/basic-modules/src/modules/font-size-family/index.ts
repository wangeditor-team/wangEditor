/**
 * @description font-size font-family
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { fontSizeMenuConf, fontFamilyMenuConf } from './menu/index'

const fontSizeAndFamily: IModuleConf = {
  addTextStyle,
  menus: [fontSizeMenuConf, fontFamilyMenuConf],
}

export default fontSizeAndFamily
