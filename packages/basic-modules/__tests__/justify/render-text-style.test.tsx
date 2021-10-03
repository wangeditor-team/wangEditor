/**
 * @description justify - render text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderTextStyle } from '../../src/modules/justify/render-text-style'

describe('justify - render text style', () => {
  it('render text style', () => {
    const elem = { type: 'paragraph', textAlign: 'center', children: [] }
    const vnode = <span>hello</span>
    // @ts-ignore 忽略 vnode 格式
    const newVnode = renderTextStyle(elem, vnode)
    // @ts-ignore 忽略 vnode 格式
    expect(newVnode.data.style?.textAlign).toBe('center')
  })
})
