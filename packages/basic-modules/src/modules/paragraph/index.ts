/**
 * @description paragraph entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderParagraphConf } from './render-elem'
import { pToHtmlConf } from './elem-to-html'

const p: IModuleConf = {
  renderElems: [renderParagraphConf],
  elemsToHtml: [pToHtmlConf],
}

export default p
