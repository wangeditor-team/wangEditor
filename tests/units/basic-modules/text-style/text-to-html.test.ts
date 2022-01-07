/**
 * @description text to html test
 * @author wangfupeng
 */

import { textStyleToHtml } from '../../../../packages/basic-modules/src/modules/text-style/text-style-to-html'

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

    const html = textStyleToHtml(textNode, '<span>hello</span>')
    expect(html).toBe(
      '<span><sup><sub><s><u><em><code><strong>hello</strong></code></em></u></s></sub></sup></span>'
    )
  })
})
