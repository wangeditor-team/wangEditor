/**
 * @description 自定义扩展 slate 接口属性
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { VideoElement } from './video-module/src/custom-types'
import { TableCellElement, TableRowElement, TableElement } from './table-module/src/custom-types'

type EmptyText = {
  text: string
}

type CustomElement = {
  type: string
  children: Descendant[]
}

declare module 'slate' {
  interface CustomTypes {
    // 扩展 Text
    Text: EmptyText // TODO 继续补充，文本格式

    // 扩展 Element
    Element: CustomElement | VideoElement | TableCellElement | TableRowElement | TableElement
  }
}
