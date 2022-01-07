/**
 * @description indent entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { styleToHtml } from './style-to-html'
import { indentMenuConf, delIndentMenuConf } from './menu/index'

const indent: Partial<IModuleConf> = {
  renderStyle,
  styleToHtml,
  menus: [indentMenuConf, delIndentMenuConf],
}

export default indent
