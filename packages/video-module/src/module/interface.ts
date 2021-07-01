/**
 * @description video module interface
 * @author wangfupeng
 */

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

interface EmptyText {
  text: string
}

export interface VideoElement {
  type: 'video'
  src: string
  children: EmptyText[]
}
