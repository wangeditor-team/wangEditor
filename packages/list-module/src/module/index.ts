/**
 * @description list module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import renderListItemConf from './render-elem'
import withList from './plugin'
import { bulletedListMenuConf, numberedListMenuConf } from './menu/index'
import listItemToHtmlConf from './elem-to-html'
import { parseItemHtmlConf, parseListHtmlConf } from './parse-elem-html'

const list: Partial<IModuleConf> = {
  renderElems: [renderListItemConf],
  editorPlugin: withList,
  menus: [bulletedListMenuConf, numberedListMenuConf],
  elemsToHtml: [listItemToHtmlConf],
  parseElemsHtml: [parseListHtmlConf, parseItemHtmlConf],
}

export default list
