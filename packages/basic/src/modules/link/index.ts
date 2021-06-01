/**
 * @description link entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withLink from './withLink'
import { renderLinkConf } from './formats'
import { insertLinkMenuConf } from './menu/index'

const link: IModuleConf = {
  renderElems: [renderLinkConf],
  menus: [insertLinkMenuConf],
  editorPlugin: withLink,
}

export default link
