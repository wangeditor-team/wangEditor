/**
 * @description list element
 * @author wangfupeng
 */

import { Text } from 'slate'

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

export type ListItemElement = {
  type: 'list-item'
  children: Text[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  children: ListItemElement[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  children: ListItemElement[]
}
