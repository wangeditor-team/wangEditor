/**
 * @description link entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withLink from './plugin'
import { renderLinkConf } from './render-elem'
import { linkToHtmlConf } from './elem-to-html'
import { parseHtmlConf } from './parse-elem-html'
import {
  insertLinkMenuConf,
  editLinkMenuConf,
  unLinkMenuConf,
  viewLinkMenuConf,
} from './menu/index'

const link: Partial<IModuleConf> = {
  renderElems: [renderLinkConf],
  elemsToHtml: [linkToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [insertLinkMenuConf, editLinkMenuConf, unLinkMenuConf, viewLinkMenuConf],
  editorPlugin: withLink,
}

export default link
