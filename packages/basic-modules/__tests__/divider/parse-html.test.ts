/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseHtmlConf } from '../../src/modules/divider/parse-elem-html'

describe('divider - parse html', () => {
  const editor = createEditor()

  it('parse html', () => {
    const $hr = $('<hr>')

    // match selector
    expect($hr[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseHtmlConf.parseElemHtml($hr[0], [], editor)
    expect(res).toEqual({
      type: 'divider',
      children: [{ text: '' }], // void node 有一个空白 text
    })
  })
})
