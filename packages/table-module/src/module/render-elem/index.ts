/**
 * @description render elem
 * @author wangfupeng
 */

import renderTable from './render-table'
import renderTableRow from './render-row'
import renderTableCell from './render-cell'

export const renderTableConf = {
  type: 'table',
  renderElem: renderTable,
}

export const renderTableRowConf = {
  type: 'table-row',
  renderElem: renderTableRow,
}

export const renderTableCellConf = {
  type: 'table-cell',
  renderElem: renderTableCell,
}
