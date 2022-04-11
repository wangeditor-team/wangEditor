/**
 * @description convert to html test
 * @author wangfupeng
 */

import createEditor from '../../src/create/create-editor'

describe('convert to html or text', () => {
  let container = document.createElement('div')

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('convert to html if give selector option', () => {
    const editor = createEditor({
      selector: container,
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(editor.getHtml()).toBe('<div>hello</div>')
  })

  it('convert to html if not give selector option', () => {
    const editor = createEditor({
      // 不传入 selector ，只有 content
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(editor.getHtml()).toBe('<div>hello</div>')
  })

  it('convert to text if give selector option', () => {
    const editor = createEditor({
      selector: container,
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
