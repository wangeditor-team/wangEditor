/**
 * @description vdom util fns test
 * @author wangfupeng
 */

import { h, VNode } from 'snabbdom'
import {
  normalizeVnodeData,
  addVnodeProp,
  addVnodeDataset,
  addVnodeStyle,
} from '../../src/utils/vdom'

describe('vdom util fns', () => {
  it('normalize vnode data', () => {
    const vnode = h(
      'div',
      {
        key: 'someKey',
        id: 'div1',
        className: 'someClassName',
        'data-custom-name': 'someCustomName',
      },
      [
        h(
          'p',
          {
            id: 'p1',
          },
          ['hello']
        ),
      ]
    )

    normalizeVnodeData(vnode)

    // 转换 div 自身
    const { data = {}, children = [] } = vnode
    expect(data.key).toBe('someKey')
    const { props = {}, dataset = {} } = data
    expect(props.id).toBe('div1')
    expect(props.className).toBe('someClassName')
    expect(dataset.customName).toBe('someCustomName')

    // 转换 div 子节点 p
    const pVNode = (children[0] || {}) as VNode
    const { props: pProps = {} } = pVNode.data || {}
    expect(pProps.id).toBe('p1')
  })

  it('add vnode props', () => {
    const vnode = h('div', {})
    addVnodeProp(vnode, { k1: 'v1' })

    const { props = {} } = vnode.data || {}
    expect(props.k1).toBe('v1')
  })

  it('add vnode dataset', () => {
    const vnode = h('div', {})
    addVnodeDataset(vnode, { k1: 'v1' })

    const { dataset = {} } = vnode.data || {}
    expect(dataset.k1).toBe('v1')
  })

  it('add vnode style', () => {
    const vnode = h('div', {})
    addVnodeStyle(vnode, { k1: 'v1' })

    const { style = {} } = vnode.data || {}
    expect(style.k1).toBe('v1')
  })
})
