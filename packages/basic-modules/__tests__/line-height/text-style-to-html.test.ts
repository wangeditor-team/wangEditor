/**
 * @description line-height text-style-to-html test
 * @author wangfupeng
 */

import { styleToHtml } from '../../src/modules/line-height/style-to-html'

describe('line-height text-style-to-html', () => {
  it('text style to html', () => {
    const elem = { type: 'paragraph', lineHeight: '1.5', children: [] }
    const html = styleToHtml(elem, '<span>hello</span>')
    expect(html).toBe('<span style="line-height: 1.5;">hello</span>')
  })
})
