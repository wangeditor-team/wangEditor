/**
 * @description block quote menu
 * @author wangfupeng
 */

import BlockquoteMenu from './BlockquoteMenu'

export const blockquoteMenuConf = {
  key: 'blockquote',
  factory() {
    return new BlockquoteMenu()
  },
}
