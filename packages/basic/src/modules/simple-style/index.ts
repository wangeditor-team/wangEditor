/**
 * @description text style entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import {
  boldMenuConf,
  underlineMenuConf,
  italicMenuConf,
  throughMenuConf,
  codeMenuConf,
} from './menu/index'

const textStyle: IModuleConf = {
  addTextStyle,
  menus: [boldMenuConf, underlineMenuConf, italicMenuConf, throughMenuConf, codeMenuConf],
}

export default textStyle
