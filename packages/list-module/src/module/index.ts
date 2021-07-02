/**
 * @description list module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderBulletedListConf, renderNumberedListConf, renderListItemConf } from './render-elem'
import { bulletedToHtmlConf, numberedToHtmlConf, listItemToHtmlConf } from './elem-to-html'
import { bulletedListMenuConf, numberedListMenuConf } from './menu/index'
import withList from './plugin'

const bold: Partial<IModuleConf> = {
  renderElems: [renderBulletedListConf, renderNumberedListConf, renderListItemConf],
  elemsToHtml: [bulletedToHtmlConf, numberedToHtmlConf, listItemToHtmlConf],
  menus: [bulletedListMenuConf, numberedListMenuConf],
  editorPlugin: withList,
}

export default bold
