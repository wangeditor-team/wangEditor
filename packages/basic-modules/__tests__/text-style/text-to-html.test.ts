/**
 * @description text to html test
 * @author wangfupeng
 */

import { styleToHtml } from '../../src/modules/text-style/style-to-html'

describe('text style - text to html', () => {
  it('text to html', () => {
    const textNode = {
      text: '',
      bold: true,
      italic: true,
      underline: true,
      code: true,
      through: true,
      sub: true,
      sup: true,
    }

    const html1 = styleToHtml(textNode, 'hello')
    expect(html1).toBe(
      '<sup><sub><s><u><em><code><strong>hello</strong></code></em></u></s></sub></sup>'
    )

    const html2 = styleToHtml(textNode, '<span>world</span>')
    expect(html2).toBe(
      '<span><sup><sub><s><u><em><code><strong>world</strong></code></em></u></s></sub></sup></span>'
    )
  })
})
