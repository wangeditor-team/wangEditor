/**
 * @description indent menu entry
 * @author wangfupeng
 */

import DecreaseIndentMenu from './DecreaseIndentMenu'
import IncreaseIndentMenu from './IncreaseIndentMenu'

export const indentMenuConf = {
  key: 'indent',
  factory() {
    return new IncreaseIndentMenu()
  },
}

export const delIndentMenuConf = {
  key: 'delIndent',
  factory() {
    return new DecreaseIndentMenu()
  },
}
