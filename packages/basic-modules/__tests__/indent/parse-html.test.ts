/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseStyleHtml } from '../../src/modules/indent/parse-style-html'
import { preParseHtmlConf } from '../../src/modules/indent/pre-parse-html'

describe('indent - parse style', () => {
  const editor = createEditor()

  it('parse style', () => {
    const $p = $('<p style="text-indent: 2em;"></p>')
    const paragraph = { type: 'paragraph', children: [{ text: 'hello' }] }

    // parse
    const res = parseStyleHtml($p[0], paragraph, editor)
    expect(res).toEqual({
      type: 'paragraph',
      indent: '2em',
      children: [{ text: 'hello' }],
    })
  })
})

describe('indent - pre parse html', () => {
  it('pre parse', () => {
    expect(preParseHtmlConf.selector).toBe('p,h1,h2,h3,h4,h5')

    const $p = $('<p style="padding-left: 2em;"></p>')

    // parse
    const res = preParseHtmlConf.preParseHtml($p[0])
    expect((res as HTMLParagraphElement).style.textIndent).toBe('2em')
  })

  it('pre parse with px unit', () => {
    expect(preParseHtmlConf.selector).toBe('p,h1,h2,h3,h4,h5')

    const $p = $('<p style="padding-left: 32px;"></p>')

    // parse
    const res = preParseHtmlConf.preParseHtml($p[0])
    expect((res as HTMLParagraphElement).style.textIndent).toBe('2em')
  })
})
