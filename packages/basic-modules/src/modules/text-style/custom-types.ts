/**
 * @description 自定义 element
 * @author wangfupeng
 */

//【注意】需要把自定义的 Text 引入到最外层的 custom-types.d.ts

export type StyledText = {
  text: string
  bold?: boolean
  code?: boolean
  italic?: boolean
  through?: boolean
  underline?: boolean
  sup?: boolean
  sub?: boolean
}
