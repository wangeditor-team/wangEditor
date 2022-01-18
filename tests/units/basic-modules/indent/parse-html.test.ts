/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import { parseStyleHtml } from '../../../../packages/basic-modules/src/modules/indent/parse-style-html'

describe('indent - parse style', () => {
  it('parse style', () => {
    const $p = $('<p style="padding-left: 32px;"></p>')
    const p = { type: 'paragraph', children: [{ text: 'hello' }] }

    // parse
    const res = parseStyleHtml($p, p)
    expect(res).toEqual({
      type: 'paragraph',
      indent: '32px',
      children: [{ text: 'hello' }],
    })
  })
})
