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
    expect(firstHtml).toEqual({
      html: '<li><span>hello</span></li>',
      prefix: '<ol>', // 第一个 item ，前面会有 <ol>
      suffix: '',
    })

    // last item
    const lastHtml = elemToHtml(orderedElem2, childrenHtml)
    expect(lastHtml).toEqual({
      html: '<li><span>hello</span></li>',
      prefix: '',
      suffix: '</ol>', // 最后一个 item ，后面会有 </ol>
    })
  })

  test(`unOrdered item toHtml`, () => {
    const { elemToHtml } = listItemToHtmlConf

    // first item
    const firstHtml = elemToHtml(unOrderedItem1, childrenHtml)
    expect(firstHtml).toEqual({
      html: '<li><span>hello</span></li>',
      prefix: '<ul>', // 第一个 item ，前面会有 <ul>
      suffix: '',
    })

    // second item
    const secondHtml = elemToHtml(unOrderedItem2, childrenHtml)
    expect(secondHtml).toEqual({
      html: '<li><span>hello</span></li>', // 第二个 item ，不应该有 <ul>
      prefix: '',
      suffix: '',
    })

    // last item - leveled
    const lastHtml = elemToHtml(unOrderedItem21, childrenHtml)
    expect(lastHtml).toEqual({
      html: '<li><span>hello</span></li>', // 最后一个 item ( leveled ) ，包裹 <ul>
      prefix: '<ul>',
      suffix: '</ul></ul>',
    })
  })
})
