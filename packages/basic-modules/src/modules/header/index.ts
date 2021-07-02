/**
 * @description header entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderHeader1Conf, renderHeader2Conf, renderHeader3Conf } from './render-elem'
import { headerMenuConf } from './menu/index'
import { header1ToHtmlConf, header2ToHtmlConf, header3ToHtmlConf } from './elem-to-html'
import withHeader from './plugin'

const bold: Partial<IModuleConf> = {
  renderElems: [renderHeader1Conf, renderHeader2Conf, renderHeader3Conf],
  elemsToHtml: [header1ToHtmlConf, header2ToHtmlConf, header3ToHtmlConf],
  menus: [headerMenuConf],
  editorPlugin: withHeader,
}

export default bold
