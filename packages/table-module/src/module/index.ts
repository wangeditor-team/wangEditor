/**
 * @description table module
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import withTable from './plugin'
import { renderTableConf, renderTableRowConf, renderTableCellConf } from './render-elem'
import { tableToHtmlConf, tableRowToHtmlConf, tableCellToHtmlConf } from './elem-to-html'
import {
  insertTableMenuConf,
  deleteTableMenuConf,
  insertTableRowConf,
  deleteTableRowConf,
  insertTableColConf,
  deleteTableColConf,
  tableHeaderMenuConf,
  tableFullWidthMenuConf,
} from './menu/index'

const table: IModuleConf = {
  renderElems: [renderTableConf, renderTableRowConf, renderTableCellConf],
  elemsToHtml: [tableToHtmlConf, tableRowToHtmlConf, tableCellToHtmlConf],
  menus: [
    insertTableMenuConf,
    deleteTableMenuConf,
    insertTableRowConf,
    deleteTableRowConf,
    insertTableColConf,
    deleteTableColConf,
    tableHeaderMenuConf,
    tableFullWidthMenuConf,
  ],
  editorPlugin: withTable,
}

export default table
