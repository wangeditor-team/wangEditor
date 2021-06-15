/**
 * @description indent entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { indentMenuConf, delIndentMenuConf } from './menu/index'

const indent: IModuleConf = {
  addTextStyle,
  menus: [indentMenuConf, delIndentMenuConf],
}

export default indent
