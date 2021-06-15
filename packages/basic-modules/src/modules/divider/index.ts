/**
 * @description divider module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withDivider from './plugin'
import { renderDividerConf } from './render-elem'
import { insertDividerMenuConf } from './menu/index'

const image: IModuleConf = {
  renderElems: [renderDividerConf],
  menus: [insertDividerMenuConf],
  editorPlugin: withDivider,
}

export default image
