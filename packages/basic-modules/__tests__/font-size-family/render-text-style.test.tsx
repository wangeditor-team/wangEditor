/**
 * @description font size and family - render text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderStyle } from '../../src/modules/font-size-family/render-style'

describe('font size and family - render text style', () => {
  it('render text style', () => {
    const fontSize = '20px'
    const fontFamily = '黑体'
    const textNode = { text: 'hello', fontSize, fontFamily }
    const vnode = <span>hello</span>

    // @ts-ignore 忽略 vnode 格式检查
    const newVnode = renderStyle(textNode, vnode) as any
    expect(newVnode.data.style.fontSize).toBe(fontSize)
    expect(newVnode.data.style.fontFamily).toBe(fontFamily)
  })
})
