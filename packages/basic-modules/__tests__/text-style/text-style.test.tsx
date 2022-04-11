/**
 * @description text style test
 * @author wangfupeng
 */

import { jsx } from 'snabbdom'
import { renderStyle } from '../../src/modules/text-style/render-style'
import { StyledText } from '../../src/modules/text-style/custom-types'

describe('text style - render text style', () => {
  it('render text style', () => {
    const vnode = <span>hello</span>
    let newVnode

    const textNode: StyledText = { text: '' }

    textNode.bold = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('strong')

    textNode.code = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('code')

    textNode.italic = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('em')

    textNode.underline = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('u')

    textNode.through = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('s')

    textNode.sub = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('sub')

    textNode.sup = true
    // @ts-ignore 忽略 vnode 格式
    newVnode = renderStyle(textNode, vnode)
    expect(newVnode.sel).toBe('sup')
  })
})
