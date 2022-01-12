/**
 * @description justify module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderStyle } from './render-style'
import { styleToHtml } from './style-to-html'
import { parseStyleHtml } from './parse-style-html'
import {
  justifyLeftMenuConf,
  justifyRightMenuConf,
  justifyCenterMenuConf,
  justifyJustifyMenuConf,
} from './menu/index'

const justify: Partial<IModuleConf> = {
  renderStyle,
  styleToHtml,
  parseStyleHtml,
  menus: [justifyLeftMenuConf, justifyRightMenuConf, justifyCenterMenuConf, justifyJustifyMenuConf],
}

export default justify
