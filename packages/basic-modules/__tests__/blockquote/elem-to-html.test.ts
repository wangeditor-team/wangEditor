/**
 * @description blockquote - elem to html test
 * @author wangfupeng
 */

import { quoteToHtmlConf } from '../../src/modules/blockquote/elem-to-html'

describe('blockquote elem to html', () => {
  it('blockquote to html', () => {
    expect(quoteToHtmlConf.type).toBe('blockquote')

    const elem = { type: 'blockquote', children: [] }
    const html = quoteToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<blockquote>hello</blockquote>')
  })
})
