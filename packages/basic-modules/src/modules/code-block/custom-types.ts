/**
 * @description 自定义 element
 * @author wangfupeng
 */

//【注意】需要把自定义的 Element 引入到最外层的 custom-types.d.ts

type PureText = {
  text: string
}

export type PreElement = {
  type: 'pre'
  children: CodeElement[]
}

export type CodeElement = {
  type: 'code'
  language: string
  children: PureText[]
}
