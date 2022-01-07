/**
 * @description line-height module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { textStyleToHtml } from './text-style-to-html'
import { lineHeightMenuConf } from './menu/index'

const lineHeight: Partial<IModuleConf> = {
  renderStyle,
  textStyleToHtml,
  menus: [lineHeightMenuConf],
}

export default lineHeight
