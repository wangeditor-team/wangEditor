/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseStyleHtml } from '../../src/modules/color/parse-style-html'
import { preParseHtmlConf } from '../../src/modules/color/pre-parse-html'

describe('color - pre parse html', () => {
  it('pre parse html', () => {
    const $font = $('<font color="rgb(204, 204, 204)">hello</font>')

    // match selector
    expect($font[0].matches(preParseHtmlConf.selector)).toBeTruthy()

    // pre parse
    const res = preParseHtmlConf.preParseHtml($font[0])
    expect(res.outerHTML).toBe('<font style="color: rgb(204, 204, 204);">hello</font>')
  })
})

describe('color - parse style html', () => {
  const editor = createEditor()

  it('parse style html', () => {
    const $span = $(
      '<span style="color: rgb(235, 144, 58); background-color: rgb(231, 246, 213);"></span>'
    )
    const textNode = { text: 'hello' }

    // parse style
    const res = parseStyleHtml($span[0], textNode, editor)
    expect(res).toEqual({
      text: 'hello',
      color: 'rgb(235, 144, 58)',
      bgColor: 'rgb(231, 246, 213)',
    })
  })
})
