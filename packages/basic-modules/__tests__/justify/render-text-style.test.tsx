/**
 * @description justify - render text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderStyle } from '../../src/modules/justify/render-style'

describe('justify - render text style', () => {
  it('render text style', () => {
    const elem = { type: 'paragraph', textAlign: 'center', children: [] }
    const vnode = <span>hello</span>
    // @ts-ignore 忽略 vnode 格式
    const newVnode = renderStyle(elem, vnode)
    // @ts-ignore 忽略 vnode 格式
    expect(newVnode.data.style?.textAlign).toBe('center')
  })
})
