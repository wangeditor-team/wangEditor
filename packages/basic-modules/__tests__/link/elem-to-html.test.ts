/**
 * @description link - elem to html test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { linkToHtmlConf } from '../../src/modules/link/elem-to-html'

describe('link elem to html', () => {
  const editor = createEditor()

  it('link to html', () => {
    expect(linkToHtmlConf.type).toBe('link')

    const url = 'https://www.wangeditor.com/'
    const target = '_blank'
    const elem = { type: 'link', url, target }

    const html = linkToHtmlConf.elemToHtml(elem, 'hello', editor)
    expect(html).toBe(`<a href="${url}" target="${target}">hello</a>`)
  })
})
