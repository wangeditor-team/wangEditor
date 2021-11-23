/**
 * @description content API test
 * @author wangfupeng
 */

import { Editor, Transforms, Node } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'

describe('editor content API', () => {
  function getStartLocation(editor) {
    return Editor.start(editor, [])
  }

  it('handleTab', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor))
    editor.handleTab()
    expect(editor.getText().length).toBe(4) // 默认 tab 键，输入 4 空格
  })

  it('getHtml', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello', bold: true }] }],
    })

    const html1 = editor.getHtml()
    expect(html1).toBe('<p>\r\n    <strong>hello</strong>\r\n</p>') // 格式化 html

    const html2 = editor.getHtml({ withFormat: false })
    expect(html2).toBe('<p><strong>hello</strong></p>') // 非格式化
  })

  it('getText', () => {
    const editor = createEditor({
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'paragraph', children: [{ text: 'world' }] },
      ],
    })
    const text = editor.getText()
    expect(text).toBe('hello\nworld')
  })

  it('isEmpty', () => {
    const editor1 = createEditor()
    expect(editor1.isEmpty()).toBeTruthy()

    const editor2 = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    expect(editor2.isEmpty()).toBeFalsy()
  })

  it('getSelectionText', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置
    expect(editor.getSelectionText()).toBe('')

    editor.select([]) // 全选
    expect(editor.getSelectionText()).toBe('hello')
  })

  it('getElemsByTypePrefix', () => {
    const editor = createEditor({
      content: [
        { type: 'header1', children: [{ text: 'a' }] },
        { type: 'header2', children: [{ text: 'b' }] },
        { type: 'paragraph', children: [{ text: 'c' }] },
      ],
    })
    const headers = editor.getElemsByTypePrefix('header')
    expect(headers.length).toBe(2)
    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(1)
    const images = editor.getElemsByTypePrefix('image')
    expect(images.length).toBe(0)
  })

  it('getElemsByType', () => {
    const editor = createEditor({
      content: [
        { type: 'header1', children: [{ text: 'a' }] },
        { type: 'header2', children: [{ text: 'b' }] },
        { type: 'paragraph', children: [{ text: 'c' }] },
      ],
    })
    const headers = editor.getElemsByType('header')
    expect(headers.length).toBe(0)
    const pList = editor.getElemsByType('paragraph')
    expect(pList.length).toBe(1)
    const images = editor.getElemsByType('image')
    expect(images.length).toBe(0)
  })

  it('deleteBackward and deleteForward', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置
    Transforms.move(editor, { distance: 2, unit: 'character' }) // 光标移动 3 个字符

    editor.deleteBackward('character') // 向后删除
    expect(editor.getText()).toBe('hllo')

    editor.deleteForward('character') // 向前删除
    expect(editor.getText()).toBe('hlo')
  })

  it('getFragment and deleteFragment', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    // 选中 'hel'lo
    editor.select({
      anchor: {
        path: [0, 0],
        offset: 0,
      },
      focus: {
        path: [0, 0],
        offset: 3,
      },
    })

    const fragment = editor.getFragment() // 获取选中内容
    expect(Node.string(fragment[0])).toBe('hel')

    editor.deleteFragment() // 删除选中内容
    expect(editor.getText()).toBe('lo')
  })

  it('insertBreak', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor)) // 光标在开始位置

    editor.insertBreak()
    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(2)
  })

  it('insertText', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor)) // 光标在开始位置
    editor.insertText('xxx')
    expect(editor.getText()).toBe('xxx')
  })

  it('clear', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    editor.clear()
    expect(editor.getText()).toBe('')
  })

  it('undo and redo', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor)) // 光标在开始位置

    editor.insertText('hello')

    // @ts-ignore
    editor.undo()
    expect(editor.getText()).toBe('')

    // @ts-ignore
    editor.redo()
    expect(editor.getText()).toBe('hello')
  })
})
