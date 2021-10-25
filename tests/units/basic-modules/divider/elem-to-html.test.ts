/**
 * @description divider - elem to html test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { dividerToHtmlConf } from '../../../../packages/basic-modules/src/modules/divider/elem-to-html'

describe('divider - elem to html', () => {
  const editor = createEditor()

  it('divider to html', () => {
    expect(dividerToHtmlConf.type).toBe('divider')

    const elem = { type: 'divider', children: [{ text: '' }] }
    const html = dividerToHtmlConf.elemToHtml(elem, '', editor)
    expect(html).toBe('<hr/>')
  })
})
