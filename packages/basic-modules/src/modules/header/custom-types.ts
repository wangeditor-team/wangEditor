/**
 * @description 自定义 element
 * @author wangfupeng
 */

import { Text } from 'slate'

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

export type Header1Element = {
  type: 'header1'
  children: Text[]
}

export type Header2Element = {
  type: 'header2'
  children: Text[]
}

export type Header3Element = {
  type: 'header3'
  children: Text[]
}

export type Header4Element = {
  type: 'header4'
  children: Text[]
}

export type Header5Element = {
  type: 'header5'
  children: Text[]
}
