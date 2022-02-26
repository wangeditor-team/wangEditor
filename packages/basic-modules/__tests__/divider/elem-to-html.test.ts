/**
 * @description divider - elem to html test
 * @author wangfupeng
 */

import { dividerToHtmlConf } from '../../src/modules/divider/elem-to-html'

describe('divider - elem to html', () => {
  it('divider to html', () => {
    expect(dividerToHtmlConf.type).toBe('divider')

    const elem = { type: 'divider', children: [{ text: '' }] }
    const html = dividerToHtmlConf.elemToHtml(elem, '')
    expect(html).toBe('<hr/>')
  })
})
