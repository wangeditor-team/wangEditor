/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../utils/create-editor'
import { parseHeader1HtmlConf } from '../../../../packages/basic-modules/src/modules/header/parse-elem-html'

describe('header - parse html', () => {
  const editor = createEditor()

  it('with children', () => {
    const $h1 = $(`<h1></h1>`)
    const children = [{ text: 'hello ' }, { text: 'world', bold: true }]

    // match selector
    expect($h1[0].matches(parseHeader1HtmlConf.selector)).toBeTruthy()

    // parse html
    const res = parseHeader1HtmlConf.parseElemHtml($h1, children, editor)
    expect(res).toEqual({
      type: `header1`,
      children: [{ text: 'hello ' }, { text: 'world', bold: true }],
    })
  })

  it('without children', () => {
    const $h1 = $(`<h1>hello world</h1>`)

    // match selector
    expect($h1[0].matches(parseHeader1HtmlConf.selector)).toBeTruthy()

    // parse html
    const res = parseHeader1HtmlConf.parseElemHtml($h1, [], editor)
    expect(res).toEqual({
      type: `header1`,
      children: [{ text: 'hello world' }],
    })
  })
})
