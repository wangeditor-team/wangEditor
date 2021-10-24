/**
 * @description font size and family - text style to html test
 * @author wangfupeng
 */

import { textStyleToHtml } from '../../../../packages/basic-modules/src/modules/font-size-family/text-style-to-html'

describe('font size and family - text style to html', () => {
  it('text style to html', () => {
    const fontSize = '20px'
    const fontFamily = '黑体'
    const textNode = { text: 'hello', fontSize, fontFamily }

    const html1 = textStyleToHtml(textNode, 'hello')
    expect(html1).toBe(
      `<span style="font-size: ${fontSize}; font-family: ${fontFamily};">hello</span>`
    )

    const html2 = textStyleToHtml(textNode, '<span>world</span>')
    expect(html2).toBe(
      `<span style="font-size: ${fontSize}; font-family: ${fontFamily};">world</span>`
    )
  })
})
