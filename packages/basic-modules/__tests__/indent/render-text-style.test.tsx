/**
 * @description indent - render text style
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderTextStyle } from '../../src/modules/indent/render-text-style'

describe('indent - render text style', () => {
  it('render text style', () => {
    const indent = '32px'
    const elem = { type: 'paragraph', indent, children: [] }
    const vnode = <p>hello</p>

    // @ts-ignore
    const newVnode = renderTextStyle(elem, vnode)
    // @ts-ignore
    expect(newVnode.data.style.paddingLeft).toBe(indent)
  })
})
