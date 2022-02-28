import { html } from 'dom7'
/**
 * @description paragraph - elem to html test
 * @author wangfupeng
 */

import { pToHtmlConf } from '../../src/modules/paragraph/elem-to-html'

describe('paragraph - elem to html', () => {
  it('paragraph to html', () => {
    expect(pToHtmlConf.type).toBe('paragraph')

    const elem = { type: 'paragraph', children: [] }
    const html = pToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<p>hello</p>')
  })

  it('paragraph to html with empty children', () => {
    expect(pToHtmlConf.type).toBe('paragraph')

    const elem = { type: 'paragraph', children: [] }
    const html = pToHtmlConf.elemToHtml(elem, '')
    expect(html).toBe('<p><br></p>')
  })
})
