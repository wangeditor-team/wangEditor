/**
 * @description list toHtml test
 * @author wangfupeng
 */

import createEditor from '../../../tests/utils/create-editor'
import { ELEM_TO_EDITOR } from '../src/utils/maps'
import listItemToHtmlConf from '../src/module/elem-to-html'

describe('module elem-to-html', () => {
  const childrenHtml = '<span>hello</span>'

  const orderedElem1 = { type: 'list-item', ordered: true, children: [{ text: '' }] }
  const orderedElem2 = { type: 'list-item', ordered: true, children: [{ text: '' }] }
  const unOrderedItem1 = { type: 'list-item', children: [{ text: '' }] }
  const unOrderedItem2 = { type: 'list-item', children: [{ text: '' }] }
  const unOrderedItem21 = { type: 'list-item', level: 1, children: [{ text: '' }] }

  const editor = createEditor({
    content: [orderedElem1, orderedElem2, unOrderedItem1, unOrderedItem2, unOrderedItem21],
  })

  // elem 绑定 editor
  ELEM_TO_EDITOR.set(orderedElem1, editor)
  ELEM_TO_EDITOR.set(orderedElem2, editor)
  ELEM_TO_EDITOR.set(unOrderedItem1, editor)
  ELEM_TO_EDITOR.set(unOrderedItem2, editor)
  ELEM_TO_EDITOR.set(unOrderedItem21, editor)

  test(`toHtml conf type`, () => {
    expect(listItemToHtmlConf.type).toBe('list-item')
  })

  test(`ordered item toHtml`, () => {
    const { elemToHtml } = listItemToHtmlConf

    // first item
    const firstHtml = elemToHtml(orderedElem1, childrenHtml)
    expect(firstHtml).toBe('<ol>' + '<li><span>hello</span></li>') // 第一个 item ，前面会有 <ol>

    // last item
    const lastHtml = elemToHtml(orderedElem2, childrenHtml)
    expect(lastHtml).toBe('<li><span>hello</span></li>' + '</ol>') // 最后一个 item ，后面会有 </ol>
  })

  test(`unOrdered item toHtml`, () => {
    const { elemToHtml } = listItemToHtmlConf

    // first item
    const firstHtml = elemToHtml(unOrderedItem1, childrenHtml)
    expect(firstHtml).toBe('<ul>' + '<li><span>hello</span></li>') // 第一个 item ，前面会有 <ul>

    // second item
    const secondHtml = elemToHtml(unOrderedItem2, childrenHtml)
    expect(secondHtml).toBe('<li><span>hello</span></li>') // 第二个 item ，不应该有 <ul>

    // last item - leveled
    const lastHtml = elemToHtml(unOrderedItem21, childrenHtml)
    expect(lastHtml).toBe('<ul>' + '<li><span>hello</span></li>' + '</ul></ul>') // 最后一个 item ( leveled ) ，包裹 <ul>
  })
})
