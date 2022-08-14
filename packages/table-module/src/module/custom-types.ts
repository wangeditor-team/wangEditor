/**
 * @description 自定义 element
 * @author wangfupeng
 */

import { Text } from 'slate'

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

export type TableCellElement = {
  type: 'table-cell'
  isHeader?: boolean // td/th 只作用于第一行
  colSpan?: number
  rowSpan?: number
  width?: string // 只作用于第一行（尚未考虑单元格合并！）
  children: Text[]
}

export type TableRowElement = {
  type: 'table-row'
  children: TableCellElement[]
}

export type TableElement = {
  type: 'table'
  width: string
  children: TableRowElement[]
}
