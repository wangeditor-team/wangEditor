/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import { BaseElement } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import { parseHtmlConf } from '../../src/modules/blockquote/parse-elem-html'

describe('blockquote - parse html', () => {
  const editor = createEditor()

  it('without children', () => {
    const $elem = $('<blockquote>hello&nbsp;world</blockquote>')

    // match selector
    expect($elem[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseHtmlConf.parseElemHtml($elem[0], [], editor)
    expect(res).toEqual({
      type: 'blockquote',
      children: [{ text: 'hello world' }],
    })
  })

  it('with children', () => {
    const $elem = $('<blockquote></blockquote>')
    const children = [{ text: 'hello ' }, { text: 'world', bold: true }]

    // parse
    const res = parseHtmlConf.parseElemHtml($elem[0], children, editor)
    expect(res).toEqual({
      type: 'blockquote',
      children: [{ text: 'hello ' }, { text: 'world', bold: true }],
    })
  })

  it('with inline children', () => {
    const $elem = $('<blockquote></blockquote>')
    const children: any[] = [
      { text: 'hello ' },
      { type: 'link', url: 'http://wangeditor.com' },
      { type: 'paragraph', children: [] },
    ]

    const isInline = editor.isInline
    editor.isInline = (element: any) => {
      if (element.type === 'link') return true
      return isInline(element)
    }

    // parse
    const res = parseHtmlConf.parseElemHtml($elem[0], children, editor)
    expect(res).toEqual({
      type: 'blockquote',
      children: [{ text: 'hello ' }, { type: 'link', url: 'http://wangeditor.com' }],
    })
  })
})
