/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseStyleHtml } from '../../src/modules/justify/parse-style-html'

describe('text align - parse style', () => {
  const editor = createEditor()

  it('parse style', () => {
    const $p = $('<p style="text-align: center;"></p>')
    const paragraph = { type: 'paragraph', children: [{ text: 'hello' }] }

    // parse
    const res = parseStyleHtml($p[0], paragraph, editor)
    expect(res).toEqual({
      type: 'paragraph',
      textAlign: 'center',
      children: [{ text: 'hello' }],
    })
  })
})
