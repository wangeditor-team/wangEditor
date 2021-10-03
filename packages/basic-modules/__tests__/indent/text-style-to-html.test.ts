/**
 * @description indent - text style to html test
 * @author wangfupeng
 */

import { textStyleToHtml } from '../../src/modules/indent/text-style-to-html'

describe('indent - text style to html', () => {
  it('text style to html', () => {
    const indent = '32px'
    const elem = { type: 'paragraph', indent, children: [] }
    const html = textStyleToHtml(elem, '<p>hello</p>')
    expect(html).toBe(`<p style="padding-left: ${indent};">hello</p>`)
  })
})
