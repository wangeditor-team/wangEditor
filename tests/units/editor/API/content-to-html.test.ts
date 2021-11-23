/**
 * @description convert to html test
 * @author wangfupeng
 */

import { createEditor } from '../../../../packages/editor/src/index'
import createWithSelector from '../../../utils/create-editor'

describe('convert to html or text', () => {
  it('convert to html if give selector option', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello', bold: true }] }],
    })
    expect(editor.getHtml()).toBe('<p>\r\n    <strong>hello</strong>\r\n</p>')
  })

  it('convert to html if give withFormat option of value is true', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello', bold: true }] }],
    })
    expect(
      editor.getHtml({
        withFormat: true,
      })
    ).toBe('<p>\r\n    <strong>hello</strong>\r\n</p>')
  })

  it('convert to html if give withFormat option of value is false', () => {
    const editor = createWithSelector({
      content: [{ type: 'paragraph', children: [{ text: 'hello', bold: true }] }],
    })
    expect(
      editor.getHtml({
        withFormat: false,
      })
    ).toBe('<p><strong>hello</strong></p>')
  })

  it('convert to html if not give selector option', () => {
    const editor = createEditor({
      // 不传入 selector ，只有 content
      content: [{ type: 'paragraph', children: [{ text: 'hello', bold: true }] }],
    })
    expect(editor.getHtml()).toBe('<p>\r\n    <strong>hello</strong>\r\n</p>')
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
