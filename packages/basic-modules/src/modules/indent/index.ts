/**
 * @description indent entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './render-text-style'
import { textStyleToHtml } from './text-style-to-html'
import { indentMenuConf, delIndentMenuConf } from './menu/index'

const indent: IModuleConf = {
  renderTextStyle,
  textStyleToHtml,
  menus: [indentMenuConf, delIndentMenuConf],
}

export default indent
