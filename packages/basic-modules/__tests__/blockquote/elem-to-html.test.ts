/**
 * @description blockquote - elem to html test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { quoteToHtmlConf } from '../../src/modules/blockquote/elem-to-html'

describe('blockquote elem to html', () => {
  const editor = createEditor()

  it('blockquote to html', () => {
    expect(quoteToHtmlConf.type).toBe('blockquote')

    const elem = { type: 'blockquote' }
    const html = quoteToHtmlConf.elemToHtml(elem, 'hello', editor)
    expect(html).toBe('<blockquote>hello</blockquote>')
  })
})
