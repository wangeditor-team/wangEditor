/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../tests/utils/create-editor'
import { parseItemHtmlConf, parseListHtmlConf } from '../src/module/parse-elem-html'

describe('list - parse html', () => {
  const editor = createEditor()

  it('parse unOrdered list item', () => {
    const $ul = $('<ul></ul>')
    const $li = $('<li></li>')
    $ul.append($li)
    const children = [{ text: 'hello' }]

    const elem = parseItemHtmlConf.parseElemHtml($li[0], children, editor)
    expect(elem).toEqual({
      type: 'list-item',
      ordered: false,
      level: 0,
      children,
    })
  })

  it('parse ordered list item', () => {
    const $ol = $('<ol></ol>')
    const $li = $('<li></li>')
    $ol.append($li)
    const children = [{ text: 'hello' }]

    const elem = parseItemHtmlConf.parseElemHtml($li[0], children, editor)
    expect(elem).toEqual({
      type: 'list-item',
      ordered: true,
      level: 0,
      children,
    })
  })

  it('parse leveled list item', () => {
    const $ul = $('<ul></ul>')
    const $ol = $('<ol></ol>')
    const $li = $('<li></li>')
    $ul.append($ol)
    $ol.append($li)
    const children = [{ text: 'hello' }]

    const elem = parseItemHtmlConf.parseElemHtml($li[0], children, editor)
    expect(elem).toEqual({
      type: 'list-item',
      ordered: true,
      level: 1,
      children,
    })
  })

  it('parse list', () => {
    const $ol = $('<ol></ol>')
    const children = [
      {
        type: 'list-item',
        ordered: true,
        children: [{ text: 'a' }],
      },
      {
        type: 'list-item',
        ordered: true,
        children: [{ text: 'b' }],
      },
      // 嵌套列表
      [
        {
          type: 'list-item',
          level: 1,
          children: [{ text: 'x' }],
        },
        {
          type: 'list-item',
          level: 1,
          children: [{ text: 'y' }],
        },
      ],
    ]
    // @ts-ignore
    const listElems = parseListHtmlConf.parseElemHtml($ol[0], children, editor)
    expect(listElems.length).toBe(4) // parse list 时，会把输出的结果（数组）flatten ，把嵌套的平铺开
  })
})
