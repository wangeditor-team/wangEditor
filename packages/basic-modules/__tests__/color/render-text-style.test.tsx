/**
 * @description color - render text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderStyle } from '../../src/modules/color/render-style'

describe('color - render text style', () => {
  it('render color style', () => {
    const color = 'rgb(51, 51, 51)'
    const bgColor = 'rgb(204, 204, 204)'
    const textNode = { text: 'hello', color, bgColor }
    const vnode = <span>hello</span>

    // @ts-ignore
    const newVnode = renderStyle(textNode, vnode) as any
    expect(newVnode.sel).toBe('span')
    expect(newVnode.data.style.color).toBe(color)
    expect(newVnode.data.style.backgroundColor).toBe(bgColor)
  })
})
