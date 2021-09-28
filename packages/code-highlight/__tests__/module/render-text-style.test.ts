/**
 * @description code-highlight render text style test
 * @author wangfupeng
 */

import { renderTextStyle } from '../../src/module/render-text-style'

describe('code-highlight render text style', () => {
  it('code text style', () => {
    const leafNode = { text: 'const', keyword: true } // 定义一个 keyword leaf text node
    const vnode: any = {}

    // @ts-ignore 忽略 vnode 格式
    const newVnode = renderTextStyle(leafNode, vnode)
    expect(newVnode.data?.props?.className).toBe('token keyword')
  })
})
