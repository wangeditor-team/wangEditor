/**
 * @description list element
 * @author wangfupeng
 */

import { Text } from 'slate'

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

export type ListItemElement = {
  type: 'list-item'
  ordered: boolean // 有序/无序
  level: number // 层级：0 1 2 ...
  children: Text[]
}
