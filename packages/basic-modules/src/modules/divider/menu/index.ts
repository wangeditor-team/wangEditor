/**
 * @description divider menu
 * @author wangfupeng
 */

import InsertDividerMenu from './InsertDividerMenu'
import DeleteDividerMenu from './DeleteDividerMenu'

export const insertDividerMenuConf = {
  key: 'divider',
  factory() {
    return new InsertDividerMenu()
  },
}

export const deleteDividerMenuConf = {
  key: 'deleteDivider',
  factory() {
    return new DeleteDividerMenu()
  },
}
