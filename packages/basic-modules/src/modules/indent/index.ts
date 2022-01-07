/**
 * @description indent entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { textStyleToHtml } from './text-style-to-html'
import { indentMenuConf, delIndentMenuConf } from './menu/index'

const indent: Partial<IModuleConf> = {
  renderStyle,
  textStyleToHtml,
  menus: [indentMenuConf, delIndentMenuConf],
}

export default indent
