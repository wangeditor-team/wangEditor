/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseStyleHtml } from '../../src/modules/font-size-family/parse-style-html'
import { preParseHtmlConf } from '../../src/modules/font-size-family/pre-parse-html'

describe('font size family - pre parse html', () => {
  it('pre parse html', () => {
    const $font = $('<font size="1" face="黑体">hello</font>')

    // match selector
    expect($font[0].matches(preParseHtmlConf.selector)).toBeTruthy()

    // pre parse
    const res = preParseHtmlConf.preParseHtml($font[0])
    expect(res.outerHTML).toBe('<font style="font-size: 12px; font-family: 黑体;">hello</font>')
  })
})

describe('font size family - parse style html', () => {
  const editor = createEditor()

  it('parse style html', () => {
    const $span = $('<span style="font-size: 12px; font-family: 黑体;"></span>')
    const textNode = { text: 'hello' }

    // parse style
    const res = parseStyleHtml($span[0], textNode, editor)
    expect(res).toEqual({
      text: 'hello',
      fontSize: '12px',
      fontFamily: '黑体',
    })
  })
})
