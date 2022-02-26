/**
 * @description link - elem to html test
 * @author wangfupeng
 */

import { linkToHtmlConf } from '../../src/modules/link/elem-to-html'

describe('link elem to html', () => {
  it('link to html', () => {
    expect(linkToHtmlConf.type).toBe('link')

    const url = 'https://www.wangeditor.com/'
    const target = '_blank'
    const elem = { type: 'link', url, target, children: [] }

    const html = linkToHtmlConf.elemToHtml(elem, 'hello')
    expect(html).toBe(`<a href="${url}" target="${target}">hello</a>`)
  })
})
