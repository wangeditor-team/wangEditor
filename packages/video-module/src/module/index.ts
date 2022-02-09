/**
 * @description video module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withVideo from './plugin'
import { renderVideoConf } from './render-elem'
import { videoToHtmlConf } from './elem-to-html'
import { preParseHtmlConf } from './pre-parse-html'
import { parseHtmlConf } from './parse-elem-html'
import { insertVideoMenuConf, deleteVideoMenuConf, uploadVideoMenuConf } from './menu/index'

const video: Partial<IModuleConf> = {
  renderElems: [renderVideoConf],
  elemsToHtml: [videoToHtmlConf],
  preParseHtml: [preParseHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [insertVideoMenuConf, deleteVideoMenuConf, uploadVideoMenuConf],
  editorPlugin: withVideo,
}

export default video
