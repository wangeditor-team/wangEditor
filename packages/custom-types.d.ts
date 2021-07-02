/**
 * @description 自定义扩展 slate 接口属性
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { StyledText } from './basic-modules/src/modules/text-style/custom-types'
import { ColorText } from './basic-modules/src/modules/color/custom-types'
import { FontSizeAndFamilyText } from './basic-modules/src/modules/font-size-family/custom-types'
import { LineHeightElement } from './basic-modules/src/modules/line-height/custom-types'
import { JustifyElement } from './basic-modules/src/modules/justify/custom-types'
import { IndentElement } from './basic-modules/src/modules/indent/custom-types'
import { ParagraphElement } from './basic-modules/src/modules/paragraph/custom-types'
import { LinkElement } from './basic-modules/src/modules/link/custom-types'
import { BlockQuoteElement } from './basic-modules/src/modules/blockquote/custom-types'
import {
  Header1Element,
  Header2Element,
  Header3Element,
} from './basic-modules/src/modules/header/custom-types'
import { DividerElement } from './basic-modules/src/modules/divider/custom-types'
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
  | LineHeightElement
  | JustifyElement
  | IndentElement
  | ParagraphElement
  | LinkElement
  | BlockQuoteElement
  | Header1Element
  | Header2Element
  | Header3Element
  | DividerElement
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
    Text: PureText | StyledText | FontSizeAndFamilyText | ColorText

    // 扩展 Element
    Element: CustomElement
  }
}
