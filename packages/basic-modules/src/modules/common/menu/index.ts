/**
 * @description common menu config
 * @author wangfupeng
 */

import EnterMenu from './EnterMenu'

export const enterMenuConf = {
  key: 'enter',
  factory() {
    return new EnterMenu()
  },
}
