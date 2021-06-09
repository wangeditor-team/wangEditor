/**
 * @description code block module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle } from './text-style'
import { renderPreConf, renderCodeConf } from './render-elem'
import { codeBlockMenuConf, selectLangMenuConf } from './menu/index'
import withCodeBlock from './plugin'

const codeBlockModule: IModuleConf = {
  addTextStyle,
  renderElems: [renderPreConf, renderCodeConf],
  menus: [codeBlockMenuConf, selectLangMenuConf],
  editorPlugin: withCodeBlock,
}

export default codeBlockModule
