/**
 * @description divider module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withDivider from './plugin'
import { renderDividerConf } from './render-elem'
import { dividerToHtmlConf } from './elem-to-html'
import { parseHtmlConf } from './parse-elem-html'
import { insertDividerMenuConf } from './menu/index'

const image: Partial<IModuleConf> = {
  renderElems: [renderDividerConf],
  elemsToHtml: [dividerToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [insertDividerMenuConf],
  editorPlugin: withDivider,
}

export default image
