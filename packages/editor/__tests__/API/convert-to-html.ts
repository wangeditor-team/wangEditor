/**
 * @description convert to html test
 * @author wangfupeng
 */

import { createEditor } from '../../src/index'

describe('convert to html', () => {
  it('convert to html', () => {
    const editor = createEditor({
      // 不传入 selector ，只有 content
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(editor.getHtml()).toBe(
      '<div class="w-e-content-container">\r\n    <p>hello</p>\r\n</div>'
    )
    expect(editor.getText()).toBe('hello')
  })
})
