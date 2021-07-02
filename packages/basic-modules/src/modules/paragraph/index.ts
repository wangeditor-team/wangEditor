/**
 * @description paragraph entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderParagraphConf } from './render-elem'
import { pToHtmlConf } from './elem-to-html'
import withParagraph from './plugin'

const p: Partial<IModuleConf> = {
  renderElems: [renderParagraphConf],
  elemsToHtml: [pToHtmlConf],
  editorPlugin: withParagraph,
}

export default p
