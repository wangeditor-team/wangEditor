/**
 * @description list render elem test
 * @author wangfupeng
 */

import createEditor from '../../../tests/utils/create-editor'
import renderList2ItemConf from '../src/module/render-elem'

describe('list module - render elem', () => {
  const unOrderedItem = { type: 'list2-item', children: [{ text: '' }] }
  const orderedItem = { type: 'list2-item', ordered: true, children: [{ text: '' }] }
  const leveledItem = { type: 'list2-item', level: 3, children: [{ text: '' }] }
  const editor = createEditor({
    content: [unOrderedItem, orderedItem, leveledItem],
  })

  it('render conf type', () => {
    expect(renderList2ItemConf.type).toBe('list2-item')
  })

  it('render ordered list item elem', () => {
    const vnode: any = renderList2ItemConf.renderElem(orderedItem, null, editor)
    expect(vnode.sel).toBe('div') // render-elem 使用 <div> 模拟 <li>

    const prefixVnode = vnode.children[0] || {}
    expect(prefixVnode.text).toBe('1.') // ordered list-item 有序号
  })

  it('render unOrdered list item elem', () => {
    const vnode: any = renderList2ItemConf.renderElem(unOrderedItem, null, editor)
    expect(vnode.sel).toBe('div') // render-elem 使用 <div> 模拟 <li>

    const prefixVnode = vnode.children[0] || {}
    expect(prefixVnode.text).toBe('•') // unOrdered list-item 点号
  })

  it('render leveled list item elem', () => {
    const vnode: any = renderList2ItemConf.renderElem(leveledItem, null, editor)
    const style = vnode.data.style
    expect(style).toEqual({ margin: '5px 0 5px 60px' }) // margin-left 60px
  })
})
