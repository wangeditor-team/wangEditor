/**
 * @description code block module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { codeBlockMenuConf } from './menu/index'
import withCodeBlock from './plugin'
import { renderPreConf, renderCodeConf } from './render-elem'

const codeBlockModule: IModuleConf = {
  menus: [codeBlockMenuConf],
  editorPlugin: withCodeBlock,
  renderElems: [renderPreConf, renderCodeConf],
}

export default codeBlockModule
