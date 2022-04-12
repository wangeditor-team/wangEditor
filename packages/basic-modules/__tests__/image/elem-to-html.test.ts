/**
 * @description image - elem to html test
 * @author wangfupeng
 */

import { imageToHtmlConf } from '../../src/modules/image/elem-to-html'

describe('image to html', () => {
  it('to html', () => {
    expect(imageToHtmlConf.type).toBe('image')

    const src = 'https://www.wangeditor.com/imgs/logo.png'
    const href = 'https://www.wangeditor.com/'
    const elem = {
      type: 'image',
      src,
      alt: 'logo',
      href,
      style: { width: '100', height: '80' },
      children: [{ text: '' }], // void node 必须包含一个空 text
    }
    const html = imageToHtmlConf.elemToHtml(elem, '')

    expect(html).toBe(
      `<img src="${src}" alt="logo" data-href="${href}" style="width: 100;height: 80;"/>`
    )
  })
})
