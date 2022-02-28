/**
 * @description indent - text style to html test
 * @author wangfupeng
 */

import { styleToHtml } from '../../src/modules/indent/style-to-html'

describe('indent - text style to html', () => {
  it('text style to html', () => {
    const indent = '2em'
    const elem = { type: 'paragraph', indent, children: [] }
    const html = styleToHtml(elem, '<p>hello</p>')
    expect(html).toBe(`<p style="text-indent: ${indent};">hello</p>`)
  })
})
