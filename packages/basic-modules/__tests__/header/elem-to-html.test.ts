/**
 * @description header - elem to html test
 * @author wangfupeng
 */

import {
  header1ToHtmlConf,
  header2ToHtmlConf,
  header3ToHtmlConf,
  header4ToHtmlConf,
  header5ToHtmlConf,
} from '../../src/modules/header/elem-to-html'

describe('header - elem to html', () => {
  const elem = { type: 'header1', children: [{ text: '' }] }
  it('header1 to html', () => {
    expect(header1ToHtmlConf.type).toBe('header1')
    const html = header1ToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<h1>hello</h1>')
  })

  it('header2 to html', () => {
    expect(header2ToHtmlConf.type).toBe('header2')
    const html = header2ToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<h2>hello</h2>')
  })

  it('header3 to html', () => {
    expect(header3ToHtmlConf.type).toBe('header3')
    const html = header3ToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<h3>hello</h3>')
  })

  it('header4 to html', () => {
    expect(header4ToHtmlConf.type).toBe('header4')
    const html = header4ToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<h4>hello</h4>')
  })

  it('header5 to html', () => {
    expect(header5ToHtmlConf.type).toBe('header5')
    const html = header5ToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<h5>hello</h5>')
  })
})
