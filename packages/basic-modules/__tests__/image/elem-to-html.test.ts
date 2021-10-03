/**
 * @description image - elem to html test
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { imageToHtmlConf } from '../../src/modules/image/elem-to-html'

describe('image to html', () => {
  const editor = createEditor()

  it('to html', () => {
    expect(imageToHtmlConf.type).toBe('image')

    const src = 'http://www.wangeditor.com/imgs/logo.jpeg'
    const href = 'https://www.wangeditor.com/'
    const elem = {
      type: 'image',
      src,
      alt: 'logo',
      href,
      style: { width: '100', height: '80' },
      children: [{ text: '' }], // void node 必须包含一个空 text
    }
    const html = imageToHtmlConf.elemToHtml(elem, '', editor)

    expect(html).toBe(
      `<img src="${src}" alt="logo" data-href="${href}" style="width: 100;height: 80;"/>`
    )
  })
})
