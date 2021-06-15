/**
 * @description table menu
 * @author wangfupeng
 */

import InsertTable from './InsertTable'
import DeleteTable from './DeleteTable'

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
