/**
 * @description convert to html test
 * @author wangfupeng
 */

import { createEditor } from '../../../../packages/editor/src/index'
import createWithSelector from '../../../utils/create-editor'

describe('convert to html or text', () => {
  it('convert to html if give selector option', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(editor.getHtml()).toBe(
      '<div class="w-e-content-container">\r\n    <p>hello</p>\r\n</div>'
    )
  })

  it('convert to html if give containerClassName option', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(
      editor.getHtml({
        containerClassName: 'customClassName',
      })
    ).toBe('<div class="customClassName">\r\n    <p>hello</p>\r\n</div>')
  })

  it('convert to html if give withFormat option of value is true', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(
      editor.getHtml({
        withFormat: true,
      })
    ).toBe('<div class="w-e-content-container">\r\n    <p>hello</p>\r\n</div>')
  })

  it('convert to html if give withFormat option of value is false', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(
      editor.getHtml({
        withFormat: false,
      })
    ).toBe('<div class="w-e-content-container"><p>hello</p></div>')
  })

  it('convert to html if give withFormat and containerClassName options', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(
      editor.getHtml({
        withFormat: false,
        containerClassName: 'customContainerClass',
      })
    ).toBe('<div class="customContainerClass"><p>hello</p></div>')
  })

  it('convert to html if not give selector option', () => {
    const editor = createEditor({
      // 不传入 selector ，只有 content
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(editor.getHtml()).toBe(
      '<div class="w-e-content-container">\r\n    <p>hello</p>\r\n</div>'
    )
  })

  it('convert to text if give selector option', () => {
    const editor = createWithSelector({
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'paragraph', children: [{ text: 'world' }] },
      ],
    })
    expect(editor.getText()).toBe('hello\nworld')
  })

  it('convert to text if not give selector option', () => {
    const editor = createEditor({
      // 不传入 selector ，只有 content
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'paragraph', children: [{ text: 'world' }] },
      ],
    })
    expect(editor.getText()).toBe('hello\nworld')
  })
})
