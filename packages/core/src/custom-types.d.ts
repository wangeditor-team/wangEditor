/**
 * @description 自定义扩展 slate 接口属性
 * @author wangfupeng
 */

import { Descendant } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    Text: {
      text: string
    }
    Element: {
      type: string
      children: Descendant[]
    }
  }
}
