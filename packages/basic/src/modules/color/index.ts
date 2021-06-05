/**
 * @description color bgColor
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { colorMenuConf, bgColorMenuConf } from './menu/index'

const color: IModuleConf = {
  addTextStyle,
  menus: [colorMenuConf, bgColorMenuConf],
}

export default color
