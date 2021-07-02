/**
 * @description video module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withVideo from './plugin'
import { renderVideoConf } from './render-elem'
import { videoToHtmlConf } from './elem-to-html'
import { insertVideoMenuConf, deleteVideoMenuConf } from './menu/index'

const video: Partial<IModuleConf> = {
  renderElems: [renderVideoConf],
  elemsToHtml: [videoToHtmlConf],
  menus: [insertVideoMenuConf, deleteVideoMenuConf],
  editorPlugin: withVideo,
}

export default video
