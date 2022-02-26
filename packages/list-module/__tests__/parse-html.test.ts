/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../tests/utils/create-editor'
import {
  parseItemHtmlConf,
  parseBulletedListHtmlConf,
  parseNumberedListHtmlConf,
} from '../src/module/parse-elem-html'

describe('list - parse html', () => {
  const editor = createEditor()

  it('list-item with children', () => {
    const $elem = $('<li></li>')
    const children = [{ text: 'hello ' }, { text: 'world', bold: true }]

    // match selector
    expect($elem[0].matches(parseItemHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseItemHtmlConf.parseElemHtml($elem[0], children, editor)
    expect(res).toEqual({
      type: 'list-item',
      children: [{ text: 'hello ' }, { text: 'world', bold: true }],
    })
  })

  it('list-item without children', () => {
    const $elem = $('<li>hello&nbsp;world</li>')

    // match selector
    expect($elem[0].matches(parseItemHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseItemHtmlConf.parseElemHtml($elem[0], [], editor)
    expect(res).toEqual({
      type: 'list-item',
      children: [{ text: 'hello world' }],
    })
  })

  it('bulleted list', () => {
    const $elem = $('<ul></ul>')
    const children = [
      { type: 'list-item', children: [{ text: 'a' }] },
      { type: 'list-item', children: [{ text: 'b' }] },
    ]

    // match selector
    expect($elem[0].matches(parseBulletedListHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseBulletedListHtmlConf.parseElemHtml($elem[0], children, editor)
    expect(res).toEqual({
      type: 'bulleted-list',
      children,
    })
  })

  it('numbered list', () => {
    const $elem = $('<ol></ol>')
    const children = [
      { type: 'list-item', children: [{ text: '1' }] },
      { type: 'list-item', children: [{ text: '2' }] },
    ]

    // match selector
    expect($elem[0].matches(parseNumberedListHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseNumberedListHtmlConf.parseElemHtml($elem[0], children, editor)
    expect(res).toEqual({
      type: 'numbered-list',
      children,
    })
  })
})
