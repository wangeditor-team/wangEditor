/**
 * @description util fns test
 * @author wangfupeng
 */

import {
  genRandomStr,
  addQueryToUrl,
  replaceHtmlSpecialSymbols,
  deReplaceHtmlSpecialSymbols,
} from '../../src/utils/util'

describe('utils', () => {
  it('gen random', () => {
    const r1 = genRandomStr()
    const r2 = genRandomStr()
    expect(r1).not.toBe(r2)
  })

  it('add query to url', () => {
    const params = { a: 10, b: 'hello' }

    const url1 = 'https://wangeditor.com/'
    expect(addQueryToUrl(url1, params)).toBe('https://wangeditor.com/?a=10&b=hello')

    const url2 = 'https://wangeditor.com/?x=1#123'
    expect(addQueryToUrl(url2, params)).toBe('https://wangeditor.com/?x=1&a=10&b=hello#123')
  })

  it('replace html symbol', () => {
    const html = '<p>hello  world</p>'
    const res = replaceHtmlSpecialSymbols(html)
    expect(res).toBe('&lt;p&gt;hello &nbsp;world&lt;/p&gt;')
  })

  it('replace html symbol', () => {
    const html = '&lt;p&gt;hello &nbsp;world&lt;/p&gt;'
    const res = deReplaceHtmlSpecialSymbols(html)
    expect(res).toBe('<p>hello  world</p>')
  })

  it('decode html quote symbol', () => {
    const html = '<p style="font-family:&quot;Times New Roman&quot;;">hello world</p>'
    const res = deReplaceHtmlSpecialSymbols(html)
    expect(res).toBe('<p style="font-family:"Times New Roman";">hello world</p>')
  })
})
