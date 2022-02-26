/**
 * @description line-height render text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderStyle } from '../../src/modules/line-height/render-style'

describe('line-height render-text-style', () => {
  it('render text style', () => {
    const elem = { type: 'paragraph', lineHeight: '1.5', children: [] }
    const vnode = <span>hello</span>
    // @ts-ignore 忽略 vnode 格式检查
    const newVnode = renderStyle(elem, vnode)
    // @ts-ignore 忽略 vnode 格式检查
    expect(newVnode.data.style.lineHeight).toBe('1.5')
  })
})
