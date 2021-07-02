/**
 * @description divider element
 * @author wangfupeng
 */

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

type EmptyText = {
  text: ''
}

export type DividerElement = {
  type: 'divider'
  children: EmptyText[]
}
