/**
 * @description blockquote entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderBlockQuoteConf } from './render-elem'
import { quoteToHtmlConf } from './elem-to-html'
import { parseHtmlConf } from './parse-elem-html'
import { blockquoteMenuConf } from './menu/index'
import withBlockquote from './plugin'

const blockquote: Partial<IModuleConf> = {
  renderElems: [renderBlockQuoteConf],
  elemsToHtml: [quoteToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [blockquoteMenuConf],
  editorPlugin: withBlockquote,
}

export default blockquote
