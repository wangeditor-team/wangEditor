/**
 * @description parse elem html
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../utils/create-editor'
import {
  parseCodeHtmlConf,
  parsePreHtmlConf,
} from '../../../../packages/basic-modules/src/modules/code-block/parse-elem-html'
import { preParseHtmlConf } from '../../../../packages/basic-modules/src/modules/code-block/pre-parse-html'

describe('code block - pre parse html', () => {
  it('pre parse html', () => {
    const $pre = $('<pre></pre>')
    const $code = $('<code><xmp>var a = 100;</xmp></code>')
    $pre.append($code)

    // match selector
    expect($code[0].matches(preParseHtmlConf.selector)).toBeTruthy()

    // pre parse
    const $res = preParseHtmlConf.preParseHtml($code)
    expect($res.html()).toBe('var a = 100;')
  })
})

describe('code block - parse html', () => {
  const editor = createEditor()

  it('parse code html', () => {
    const $pre = $('<pre></pre>')
    const $code = $('<code><xmp>var a = 100;</xmp></code>')
    $pre.append($code)

    // match selector
    expect($code[0].matches(parseCodeHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseCodeHtmlConf.parseElemHtml($code, [], editor)
    expect(res).toEqual({
      type: 'code',
      language: '',
      children: [{ text: 'var a = 100;' }],
    })
  })
  it('parse pre html', () => {
    const $pre = $('<pre></pre>')
    const children = [
      {
        type: 'code',
        language: '',
        children: [{ text: 'var a = 100;' }],
      },
    ]

    // match selector
    expect($pre[0].matches(parsePreHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parsePreHtmlConf.parseElemHtml($pre, children, editor)
    expect(res).toEqual({
      type: 'pre',
      children: [
        {
          type: 'code',
          language: '',
          children: [{ text: 'var a = 100;' }],
        },
      ],
    })
  })
})
