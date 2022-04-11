/**
 * @description color - text style to html test
 * @author wangfupeng
 */

import { styleToHtml } from '../../src/modules/color/style-to-html'

describe('color - text style to html', () => {
  it('color to html', () => {
    const color = 'rgb(51, 51, 51)'
    const bgColor = 'rgb(204, 204, 204)'
    const textNode = { text: '', color, bgColor }

    const html = styleToHtml(textNode, '<span>hello</span>')
    expect(html).toBe(`<span style="color: ${color}; background-color: ${bgColor};">hello</span>`)
  })
})
