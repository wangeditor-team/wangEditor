/**
 * @description header entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'

import { renderHeader1Conf, renderHeader2Conf, renderHeader3Conf } from './formats'
import menuConf from './menu'

const bold: IModuleConf = {
  renderElemConfArr: [renderHeader1Conf, renderHeader2Conf, renderHeader3Conf],
  menuConf,
}

export default bold
