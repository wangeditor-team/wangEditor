/**
 * @description header entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderHeader1Conf, renderHeader2Conf, renderHeader3Conf } from './formats'
import menuConf from './menu'
import withHeader from './withHeader'

const bold: IModuleConf = {
  renderElems: [renderHeader1Conf, renderHeader2Conf, renderHeader3Conf],
  menus: [menuConf],
  editorPlugin: withHeader,
}

export default bold
