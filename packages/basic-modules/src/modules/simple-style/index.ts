/**
 * @description text style entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './text-style'
import { textToHtml } from './text-to-html'
import {
  boldMenuConf,
  underlineMenuConf,
  italicMenuConf,
  throughMenuConf,
  codeMenuConf,
} from './menu/index'

const textStyle: IModuleConf = {
  renderTextStyle,
  menus: [boldMenuConf, underlineMenuConf, italicMenuConf, throughMenuConf, codeMenuConf],
  textToHtml,
}

export default textStyle
