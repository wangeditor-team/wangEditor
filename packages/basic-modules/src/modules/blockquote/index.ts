/**
 * @description blockquote entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderBlockQuoteConf } from './render-elem'
import { blockquoteMenuConf } from './menu/index'
import withBlockquote from './plugin'

const blockquote: IModuleConf = {
  renderElems: [renderBlockQuoteConf],
  menus: [blockquoteMenuConf],
  editorPlugin: withBlockquote,
}

export default blockquote
