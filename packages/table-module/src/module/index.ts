/**
 * @description table module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withTable from './plugin'
import { renderTableConf, renderTableRowConf, renderTableCellConf } from './render-elem'
import { insertTableMenuConf, deleteTableMenuConf } from './menu/index'

const table: IModuleConf = {
  renderElems: [renderTableConf, renderTableRowConf, renderTableCellConf],
  menus: [insertTableMenuConf, deleteTableMenuConf],
  editorPlugin: withTable,
}

export default table
