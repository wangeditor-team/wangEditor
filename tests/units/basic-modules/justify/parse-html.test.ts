/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import { parseStyleHtml } from '../../../../packages/basic-modules/src/modules/justify/parse-style-html'

describe('text align - parse style', () => {
  it('parse style', () => {
    const $p = $('<p style="text-align: center;"></p>')
    const p = { type: 'paragraph', children: [{ text: 'hello' }] }

    // parse
    const res = parseStyleHtml($p, p)
    expect(res).toEqual({
      type: 'paragraph',
      textAlign: 'center',
      children: [{ text: 'hello' }],
    })
  })
})
