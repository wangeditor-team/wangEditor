/**
 * @description code highlight module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { selectLangMenuConf } from './menu/index'

const codeHighlightModule: IModuleConf = {
  addTextStyle,
  menus: [selectLangMenuConf],
}

export default codeHighlightModule
