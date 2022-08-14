/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseStyleHtml } from '../../src/modules/line-height/parse-style-html'

describe('line height - parse style', () => {
  const editor = createEditor()

  it('parse style', () => {
    const $p = $('<p style="line-height: 2.5;"></p>')
    const paragraph = { type: 'paragraph', children: [{ text: 'hello' }] }

    // parse
    const res = parseStyleHtml($p[0], paragraph, editor)
    expect(res).toEqual({
      type: 'paragraph',
      lineHeight: '2.5',
      children: [{ text: 'hello' }],
    })
  })
})
