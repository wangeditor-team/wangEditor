/**
 * @description code-highlight render text style test
 * @author wangfupeng
 */

import { renderStyle } from '../src/module/render-style'
import { jsx } from 'snabbdom'

describe('code-highlight render text style', () => {
  it('code text style', () => {
    const leafNode = { text: 'let', keyword: true } // 定义一个 keyword leaf text node
    const vnode = <span>let</span>

    // @ts-ignore 忽略 vnode 格式检查
    const newVnode = renderStyle(leafNode, vnode)
    expect(newVnode.data?.props?.className).toBe('token keyword')
  })
})
