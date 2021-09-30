/**
 * @description text to html test
 * @author wangfupeng
 */

import { textToHtml } from '../../src/modules/text-style/text-to-html'
import createEditor from '../../../../tests/utils/create-editor'

describe('text style - text to html', () => {
  const editor = createEditor()

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

    const html = textToHtml(textNode, 'hello', editor)
    expect(html).toBe(
      '<sup><sub><s><u><em><code><strong>hello</strong></code></em></u></s></sub></sup>'
    )
  })
})
