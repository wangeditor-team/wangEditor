/**
 * @description 自定义 element
 * @author wangfupeng
 */

// 拷贝自 basic-modules/src/modules/code-block/custom-types.ts

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
