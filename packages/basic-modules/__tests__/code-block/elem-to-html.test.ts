/**
 * @description code-block elem to html test
 * @author wangfupeng
 */

import { codeToHtmlConf, preToHtmlConf } from '../../src/modules/code-block/elem-to-html'

describe('code-block - elem to html', () => {
  it('code to html', () => {
    expect(codeToHtmlConf.type).toBe('code')
    const elem = { type: 'code', children: [] }
    const html = codeToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<code>hello</code>')
  })

  it('pre to html', () => {
    expect(preToHtmlConf.type).toBe('pre')
    const elem = { type: 'pre', children: [] }
    const html = preToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe('<pre>hello</pre>')
  })
})
