/**
 * @description justify - text style to html test
 * @author wangfupeng
 */

import { textStyleToHtml } from '../../src/modules/justify/text-style-to-html'

describe('justify text-style-to-html', () => {
  it('text style to html', () => {
    const elem = { type: 'paragraph', textAlign: 'center', children: [] }
    const html = textStyleToHtml(elem, '<span>hello</span>')
    expect(html).toBe('<span style="text-align: center;">hello</span>')
  })
})
