/**
 * @description video module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withVideo from './plugin'
import { renderVideoConf } from './render-elem'
import { insertVideoMenuConf, deleteVideoMenuConf } from './menu/index'

const video: IModuleConf = {
  renderElems: [renderVideoConf],
  menus: [insertVideoMenuConf, deleteVideoMenuConf],
  editorPlugin: withVideo,
}

export default video
