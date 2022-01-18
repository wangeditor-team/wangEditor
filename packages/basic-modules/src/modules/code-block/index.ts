/**
 * @description code block module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { codeBlockMenuConf } from './menu/index'
import withCodeBlock from './plugin'
import { renderPreConf, renderCodeConf } from './render-elem'
import { preParseHtmlConf } from './pre-parse-html'
import { parseCodeHtmlConf, parsePreHtmlConf } from './parse-elem-html'
import { codeToHtmlConf, preToHtmlConf } from './elem-to-html'

const codeBlockModule: Partial<IModuleConf> = {
  menus: [codeBlockMenuConf],
  editorPlugin: withCodeBlock,
  renderElems: [renderPreConf, renderCodeConf],
  elemsToHtml: [codeToHtmlConf, preToHtmlConf],
  preParseHtml: [preParseHtmlConf],
  parseElemsHtml: [parseCodeHtmlConf, parsePreHtmlConf],
}

export default codeBlockModule
