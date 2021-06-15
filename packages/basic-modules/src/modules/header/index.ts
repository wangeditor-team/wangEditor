/**
 * @description header entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderHeader1Conf, renderHeader2Conf, renderHeader3Conf } from './render-elem'
import { headerMenuConf } from './menu/index'
import withHeader from './plugin'

const bold: IModuleConf = {
  renderElems: [renderHeader1Conf, renderHeader2Conf, renderHeader3Conf],
  menus: [headerMenuConf],
  editorPlugin: withHeader,
}

export default bold
