/**
 * @description line-height module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { styleToHtml } from './style-to-html'
import { lineHeightMenuConf } from './menu/index'

const lineHeight: Partial<IModuleConf> = {
  renderStyle,
  styleToHtml,
  menus: [lineHeightMenuConf],
}

export default lineHeight
