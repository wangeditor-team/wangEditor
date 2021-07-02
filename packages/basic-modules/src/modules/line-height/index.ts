/**
 * @description line-height module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderTextStyle } from './render-text-style'
import { textStyleToHtml } from './text-style-to-html'
import { lineHeightMenuConf } from './menu/index'

const lineHeight: Partial<IModuleConf> = {
  renderTextStyle,
  textStyleToHtml,
  menus: [lineHeightMenuConf],
}

export default lineHeight
