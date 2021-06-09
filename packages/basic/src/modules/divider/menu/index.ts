/**
 * @description divider menu
 * @author wangfupeng
 */

import InsertDividerMenu from './InsertDividerMenu'

export const insertDividerMenuConf = {
  key: 'divider',
  factory() {
    return new InsertDividerMenu()
  },
}
