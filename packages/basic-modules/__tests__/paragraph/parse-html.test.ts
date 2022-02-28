/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseParagraphHtmlConf } from '../../src/modules/paragraph/parse-elem-html'

describe('paragraph - parse html', () => {
  const editor = createEditor()

  it('without children', () => {
    const $elem = $('<p>hello&nbsp;world</p>')

    // match selector
    expect($elem[0].matches(parseParagraphHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseParagraphHtmlConf.parseElemHtml($elem[0], [], editor)
    expect(res).toEqual({
      type: 'paragraph',
      children: [{ text: 'hello world' }],
    })
  })

  it('with children', () => {
    const $elem = $('<p></p>')
    const children = [{ text: 'hello ' }, { text: 'world', bold: true }]

    // parse
    const res = parseParagraphHtmlConf.parseElemHtml($elem[0], children, editor)
    expect(res).toEqual({
      type: 'paragraph',
      children: [{ text: 'hello ' }, { text: 'world', bold: true }],
    })
  })
})
