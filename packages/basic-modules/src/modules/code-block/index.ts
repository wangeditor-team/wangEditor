/**
 * @description code block module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { codeBlockMenuConf } from './menu/index'
import withCodeBlock from './plugin'
import { renderPreConf, renderCodeConf } from './render-elem'
import { codeToHtmlConf, preToHtmlConf } from './elem-to-html'

const codeBlockModule: Partial<IModuleConf> = {
  menus: [codeBlockMenuConf],
  editorPlugin: withCodeBlock,
  renderElems: [renderPreConf, renderCodeConf],
  elemsToHtml: [codeToHtmlConf, preToHtmlConf],
}

export default codeBlockModule
