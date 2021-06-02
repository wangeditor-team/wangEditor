/**
 * @description menu entry
 * @author wangfupeng
 */

import HeaderMenu from './HeaderMenu'

export const headerMenuConf = {
  key: 'header',
  factory() {
    return new HeaderMenu()
  },
}
