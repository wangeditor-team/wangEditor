/**
 * @description content API test
 * @author wangfupeng
 */

import { Editor, Transforms, Node, Selection } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import { IDomEditor } from '@wangeditor/core/src/editor/interface'

let editor: IDomEditor

function setEditorSelection(
  editor: IDomEditor,
  selection: Selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  }
) {
  editor.selection = selection
}

const ignoreTag = [
  'doctype',
  '!doctype',
  'meta',
  'script',
  'style',
  'link',
  'frame',
  'iframe',
  'title',
  'svg',
]

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

    const html = editor.getHtml()
    expect(html).toBe('<p><strong>hello</strong></p>')
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

  describe('dangerouslyInsertHtml api', () => {
    beforeEach(() => {
      editor = createEditor()
    })

    test('dangerouslyInsertHtml should insert text with no blank to editor', () => {
      // insertText 必须要设置 selection 才能生效
      setEditorSelection(editor)

      const htmlString = '<div>wangEditor!</p>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.getText().indexOf('wangEditor')).toBeGreaterThan(-1)
    })

    test('dangerouslyInsertHtml should insert html string with header element to editor', () => {
      const htmlString = '<h1>wangEditor</h1>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.getText().indexOf('wangEditor')).toBeGreaterThan(-1)
    })

    test('dangerouslyInsertHtml should insert html string with pre element to editor', () => {
      const htmlString = '<pre><code>var name="wangEditor"</code></h1>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.getText().indexOf('wangEditor')).toBeGreaterThan(-1)
    })

    test('dangerouslyInsertHtml should insert html string with img element to editor', () => {
      const htmlString = '<img src="test.png" alt="test" />'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: '' },
            { type: 'image', src: 'test.png', alt: 'test', children: [{ text: '' }] },
            { text: '' },
          ],
        },
      ])
    })

    test('dangerouslyInsertHtml should insert html string with link element to editor', () => {
      const htmlString = '<a href="https://www.baidu.com/" target="_blank">wangEditor</a>'
      editor.dangerouslyInsertHtml(htmlString)

      const links = editor.getElemsByType('link')
      expect(links.length).toBe(1)
      expect((links[0] as any).url).toBe('https://www.baidu.com/')
    })

    test('dangerouslyInsertHtml should insert html string with ul element to editor', () => {
      const htmlString = '<ul><li>1</li><li>2</li></ul>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.children).toEqual([
        { type: 'paragraph', children: [{ text: '' }] },
        {
          type: 'bulleted-list',
          children: [
            { type: 'list-item', children: [{ text: '1' }] },
            { type: 'list-item', children: [{ text: '2' }] },
          ],
        },
        { type: 'paragraph', children: [{ text: '' }] },
      ])
    })

    test('dangerouslyInsertHtml should insert html string with ol element to editor', () => {
      const htmlString = '<ol><li>1</li><li>2</li></ol>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.children).toEqual([
        { type: 'paragraph', children: [{ text: '' }] },
        {
          type: 'numbered-list',
          children: [
            { type: 'list-item', children: [{ text: '1' }] },
            { type: 'list-item', children: [{ text: '2' }] },
          ],
        },
        { type: 'paragraph', children: [{ text: '' }] },
      ])
    })

    test('dangerouslyInsertHtml should can not insert html string to editor if over max length', () => {
      editor = createEditor({
        config: {
          maxLength: 20,
        },
        content: [{ type: 'paragraph', children: [{ text: '123456789012345678' }] }],
      })

      const htmlString = '<h1>wangEditor</h1>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.getText().indexOf('wangEditor')).toBe(-1)
    })

    ignoreTag.forEach(tag => {
      test(`insert html string with ${tag} element should to be ingore`, () => {
        const htmlString = `<${tag}></tag>`
        editor.dangerouslyInsertHtml(htmlString)

        expect(editor.getHtml().indexOf(tag)).toBe(-1)
      })
    })
  })
})
