/**
 * @description 自定义扩展 slate 接口属性
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { PreElement, CodeElement } from './basic-modules/src/modules/code-block/custom-types'
import { VideoElement } from './video-module/src/module/custom-types'
import {
  TableCellElement,
  TableRowElement,
  TableElement,
} from './table-module/src/module/custom-types'
import {
  ListItemElement,
  NumberedListElement,
  BulletedListElement,
} from './list-module/src/module/custom-types'

type PureText = {
  text: string
}

type BaseElement = {
  type: string
  children: Descendant[]
}

type CustomElement =
  | BaseElement
  | PreElement
  | CodeElement
  | VideoElement
  | TableCellElement
  | TableRowElement
  | TableElement
  | ListItemElement
  | NumberedListElement
  | BulletedListElement

declare module 'slate' {
  interface CustomTypes {
    // 扩展 Text
    Text: PureText // TODO 继续补充，文本格式

    // 扩展 Element
    Element: CustomElement
  }
}
