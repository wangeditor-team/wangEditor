/**
 * @description table menu
 * @author wangfupeng
 */

import InsertTable from './InsertTable'
import DeleteTable from './DeleteTable'
import InsertRow from './InsertRow'
import DeleteRow from './DeleteRow'
import InsertCol from './InsertCol'
import DeleteCol from './DeleteCol'
import TableHander from './TableHeader'
import FullWidth from './FullWidth'

export const insertTableMenuConf = {
  key: 'insertTable',
  factory() {
    return new InsertTable()
  },
}

export const deleteTableMenuConf = {
  key: 'deleteTable',
  factory() {
    return new DeleteTable()
  },
}

export const insertTableRowConf = {
  key: 'insertTableRow',
  factory() {
    return new InsertRow()
  },
}

export const deleteTableRowConf = {
  key: 'deleteTableRow',
  factory() {
    return new DeleteRow()
  },
}

export const insertTableColConf = {
  key: 'insertTableCol',
  factory() {
    return new InsertCol()
  },
}

export const deleteTableColConf = {
  key: 'deleteTableCol',
  factory() {
    return new DeleteCol()
  },
}

export const tableHeaderMenuConf = {
  key: 'tableHeader',
  factory() {
    return new TableHander()
  },
}

export const tableFullWidthMenuConf = {
  key: 'tableFullWidth',
  factory() {
    return new FullWidth()
  },
}
