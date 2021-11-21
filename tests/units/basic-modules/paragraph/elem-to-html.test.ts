import { html } from 'dom7'
/**
 * @description paragraph - elem to html test
 * @author wangfupeng
 */

import { pToHtmlConf } from '../../../../packages/basic-modules/src/modules/paragraph/elem-to-html'

describe('paragraph - elem to html', () => {
  it('paragraph to html', () => {
    expect(pToHtmlConf.type).toBe('paragraph')

    const elem = { type: 'paragraph' }
    const html = pToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<p>hello</p>')
  })
})
