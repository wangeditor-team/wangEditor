/**
 * @description 自定义扩展 slate 接口属性
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { VideoElement } from './video-module/src/module/interface'

interface EmptyText {
  text: string
}
interface CustomText {
  text: string
  [key: string]: any
}

interface CustomElement {
  type: string
  children: Descendant[]
  [key: string]: any
}

declare module 'slate' {
  interface CustomTypes {
    // 扩展 Text
    Text: EmptyText | CustomText

    // 扩展 Element
    Element: CustomElement | VideoElement
  }
}
