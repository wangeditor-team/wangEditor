/**
 * @description line-height module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { lineHeightMenuConf } from './menu/index'

const lineHeight: IModuleConf = {
  addTextStyle,
  menus: [lineHeightMenuConf],
}

export default lineHeight
