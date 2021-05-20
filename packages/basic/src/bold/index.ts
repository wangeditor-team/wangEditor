/**
 * @description bold entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { addTextStyle, renderParagraphConf } from './formats'
import menuConf from './menu'
import withBold from './with-bold'

const bold: IModuleConf = {
  addTextStyle,
  renderElemConfArr: [renderParagraphConf],
  menuConf,
  editorPlugin: withBold,
}

export default bold
