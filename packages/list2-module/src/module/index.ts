/**
 * @description list2 module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import renderList2ItemConf from './render-elem'
import withList from './plugin'
import { bulletedListMenuConf, numberedListMenuConf } from './menu/index'
import listItemToHtmlConf from './elem-to-html'
import { parseItemHtmlConf, parseListHtmlConf } from './parse-elem-html'

const list2: Partial<IModuleConf> = {
  renderElems: [renderList2ItemConf],
  editorPlugin: withList,
  menus: [bulletedListMenuConf, numberedListMenuConf],
  elemsToHtml: [listItemToHtmlConf],
  parseElemsHtml: [parseListHtmlConf, parseItemHtmlConf],
}

export default list2
