/**
 * @description paragraph entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import { renderParagraphConf } from './formats'

const p: IModuleConf = {
  renderElems: [renderParagraphConf],
}

export default p
