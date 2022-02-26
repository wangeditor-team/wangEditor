/**
 * @description font size and family - text style to html test
 * @author wangfupeng
 */

import { styleToHtml } from '../../src/modules/font-size-family/style-to-html'

describe('font size and family - text style to html', () => {
  it('text style to html', () => {
    const fontSize = '20px'
    const fontFamily = '黑体'
    const textNode = { text: '', fontSize, fontFamily }

    const html = styleToHtml(textNode, '<span>hello</span>')
    expect(html).toBe(
      `<span style="font-size: ${fontSize}; font-family: ${fontFamily};">hello</span>`
    )
  })
})
