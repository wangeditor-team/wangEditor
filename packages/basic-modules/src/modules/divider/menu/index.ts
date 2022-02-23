/**
 * @description divider menu
 * @author wangfupeng
 */

import InsertDividerMenu from './InsertDividerMenu'
// import DeleteDividerMenu from './DeleteDividerMenu.ts'

export const insertDividerMenuConf = {
  key: 'divider',
  factory() {
    return new InsertDividerMenu()
  },
}

// export const deleteDividerMenuConf = {
//   key: 'deleteDivider',
//   factory() {
//     return new DeleteDividerMenu()
//   },
// }
// divider 可用键盘删除了，所以注释掉该菜单 wangfupeng 22.02.23
