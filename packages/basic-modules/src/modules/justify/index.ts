/**
 * @description justify module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { justifyLeftMenuConf, justifyRightMenuConf, justifyCenterMenuConf } from './menu/index'

const justify: IModuleConf = {
  addTextStyle,
  menus: [justifyLeftMenuConf, justifyRightMenuConf, justifyCenterMenuConf],
}

export default justify
