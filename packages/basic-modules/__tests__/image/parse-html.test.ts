/**
 * @description parse html test
 * @author wangfupeng
 */

import { $ } from 'dom7'
import createEditor from '../../../../tests/utils/create-editor'
import { parseHtmlConf } from '../../src/modules/image/parse-elem-html'

describe('image - parse html', () => {
  const editor = createEditor()

  it('parse html', () => {
    const $img = $(
      '<img src="hello.png" alt="hello" data-href="http://localhost/" style="width: 10px; height: 5px;"/>'
    )

    // match selector
    expect($img[0].matches(parseHtmlConf.selector)).toBeTruthy()

    // parse
    const res = parseHtmlConf.parseElemHtml($img[0], [], editor)
    expect(res).toEqual({
      type: 'image',
      src: 'hello.png',
      alt: 'hello',
      href: 'http://localhost/',
      style: {
        width: '10px',
        height: '5px',
      },
      children: [{ text: '' }],
    })
  })
})
