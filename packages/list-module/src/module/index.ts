/**
 * @description list module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderBulletedListConf, renderNumberedListConf, renderListItemConf } from './render-elem'
import { bulletedListMenuConf, numberedListMenuConf } from './menu/index'
import withList from './plugin'

const bold: IModuleConf = {
  renderElems: [renderBulletedListConf, renderNumberedListConf, renderListItemConf],
  menus: [bulletedListMenuConf, numberedListMenuConf],
  editorPlugin: withList,
}

export default bold
