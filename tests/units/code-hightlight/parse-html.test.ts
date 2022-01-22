/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import { parseCodeStyleHtml } from '@wangeditor/code-highlight/src/module/parse-style-html'

describe('code highlight - parse style html', () => {
  it('v5 format', () => {
    const $code = $('<code class="language-javascript"></code>') // v5 html format
    const code = { type: 'code', children: [{ text: 'var a = 100;' }] }

    const res = parseCodeStyleHtml($code, code)
    expect(res).toEqual({
      type: 'code',
      language: 'javascript',
      children: [{ text: 'var a = 100;' }],
    })
  })

  it('v4 format', () => {
    const $code = $('<code class="Javascript"></code>') // v4 html format
    const code = { type: 'code', children: [{ text: 'var a = 100;' }] }

    const res = parseCodeStyleHtml($code, code)
    expect(res).toEqual({
      type: 'code',
      language: 'javascript',
      children: [{ text: 'var a = 100;' }],
    })
  })
})
