/**
 * @description color - render text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderTextStyle } from '../../src/modules/color/render-text-style'

describe('color - render text style', () => {
  it('render color style', () => {
    const color = 'rgb(51, 51, 51)'
    const bgColor = 'rgb(204, 204, 204)'
    const textNode = { text: 'hello', color, bgColor }
    const vnode = <span>hello</span>

    // @ts-ignore
    const newVnode = renderTextStyle(textNode, vnode) as any
    expect(newVnode.sel).toBe('span')
    expect(newVnode.data.style.color).toBe(color)
    expect(newVnode.data.style.backgroundColor).toBe(bgColor)
  })
})
