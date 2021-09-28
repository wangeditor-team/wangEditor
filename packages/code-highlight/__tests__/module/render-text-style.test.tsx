/**
 * @description code-highlight render text style test
 * @author wangfupeng
 */

import { renderTextStyle } from '../../src/module/render-text-style'
import { jsx } from 'snabbdom'

describe('code-highlight render text style', () => {
  it('code text style', () => {
    const leafNode = { text: 'let', keyword: true } // 定义一个 keyword leaf text node
    const vnode = <span>let</span>

    // @ts-ignore 忽略 vnode 格式检查
    const newVnode = renderTextStyle(leafNode, vnode)
    expect(newVnode.data?.props?.className).toBe('token keyword')
  })
})
