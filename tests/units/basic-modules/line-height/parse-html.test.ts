/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import { parseStyleHtml } from '../../../../packages/basic-modules/src/modules/line-height/parse-style-html'

describe('line height - parse style', () => {
  it('parse style', () => {
    const $p = $('<p style="line-height: 2.5;"></p>')
    const p = { type: 'paragraph', children: [{ text: 'hello' }] }

    // parse
    const res = parseStyleHtml($p, p)
    expect(res).toEqual({
      type: 'paragraph',
      lineHeight: '2.5',
      children: [{ text: 'hello' }],
    })
  })
})
