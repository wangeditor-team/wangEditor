/**
 * @description content API test
 * @author wangfupeng
 */

import { Editor, Transforms, Node, Selection } from 'slate'
import createCoreEditor from '../../create-core-editor' // packages/core 不依赖 packages/editor ，不能使用后者的 createEditor
import { withContent } from '../../../src/editor/plugins/with-content'
import { IDomEditor } from '../../../src/editor/interface'

function createEditor(...args) {
  return withContent(createCoreEditor(...args))
}

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
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })

    const html = editor.getHtml()
    expect(html).toBe('<div>hello</div>')
  })

  it('getHtml with void element', () => {
    const editor = createEditor({
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'image', children: [{ text: '' }], src: 'test.jpg' },
      ],
    })

    const html = editor.getHtml()
    expect(html).toBe('<div>hello</div><div></div>')
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

  it('deleteBackward with character', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置
    Transforms.move(editor, { distance: 2, unit: 'character' }) // 光标移动 2 个字符

    editor.deleteBackward('character') // 向后删除
    expect(editor.getText()).toBe('hllo')
  })

  it('deleteBackward with word', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello world' }] }],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置
    Transforms.move(editor, { distance: 1, unit: 'word' }) // 光标移动 1 个单词

    editor.deleteBackward('word') // 向后删除
    expect(editor.getText()).toBe(' world')
  })

  it('deleteForward with character', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello' }] }],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置
    Transforms.move(editor, { distance: 1, unit: 'character' }) // 光标移动 1 个字符

    editor.deleteForward('character') // 向前删除
    expect(editor.getText()).toBe('hllo')
  })

  it('deleteForward with word', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'hello world' }] }],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置
    Transforms.move(editor, { distance: 1, unit: 'word' }) // 光标移动 1 个 word

    editor.deleteForward('word') // 向前删除
    expect(editor.getText()).toBe('hello')
  })

  it('deleteForward with line', () => {
    const editor = createEditor({
      content: [
        { type: 'paragraph', children: [{ text: 'hello' }] },
        { type: 'paragraph', children: [{ text: 'world' }] },
      ],
    })
    editor.select(getStartLocation(editor)) // 光标在开始位置

    editor.deleteForward('line') // 向前删除
    expect(editor.getText()).toBe('\nworld')
  })

  it('getFragment', () => {
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
  })

  it('deleteFragment', () => {
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

  it('undo', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor)) // 光标在开始位置

    editor.insertText('hello')

    // @ts-ignore
    editor.undo()
    expect(editor.getText()).toBe('')
  })

  it('redo', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor)) // 光标在开始位置

    editor.insertText('hello')

    // @ts-ignore
    editor.undo()
    // @ts-ignore
    editor.redo()
    expect(editor.getText()).toBe('hello')
  })

  describe('dangerouslyInsertHtml API', () => {
    beforeEach(() => {
      editor = createEditor()
    })

    // 现在使用的是 packages/core 的 createEditor ，创建的 editor 没有内置各种 module
    // 所以 dangerouslyInsertHtml 在此测试基本功能即可。其他 tag 在各自的 module 中测试

    test('dangerouslyInsertHtml should insert text with no blank to editor', () => {
      // insertText 必须要设置 selection 才能生效
      setEditorSelection(editor)

      const htmlString = '<div>wangEditor!</div>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.getText().indexOf('wangEditor')).toBeGreaterThan(-1)
    })

    ignoreTag.forEach(tag => {
      test(`insert html string with ${tag} element should to be ignore`, () => {
        setEditorSelection(editor)
        const htmlString = `<${tag}></${tag}>`
        editor.dangerouslyInsertHtml(htmlString)

        expect(editor.getHtml().indexOf(tag)).toBe(-1)
      })
    })
  })

  it('getParentNode', () => {
    const textNode = { text: 'hello' }
    const p = { type: 'paragraph', children: [textNode] }
    const editor = createEditor({
      content: [p],
    })

    const parentNode = editor.getParentNode(textNode) as any
    expect(parentNode).not.toBeNull()
    expect(parentNode.type).toBe('paragraph')
  })

  it('insertNode', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor))

    const p = { type: 'paragraph', children: [{ text: 'hello' }] }
    editor.insertNode(p)

    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(2)
  })

  describe('setHtml', () => {
    it('setHtml normal', () => {
      const editor = createEditor({ html: '<div>hello</div>' })
      editor.select(getStartLocation(editor))

      const newHtml = '<div>world</div>'
      editor.setHtml(newHtml)

      expect(editor.getHtml()).toBe(newHtml)
    })

    it('setHtml blur', () => {
      const editor = createEditor({
        html: '<div>hello</div>',
        autoFocus: false,
      })
      expect(editor.isFocused()).toBe(false)

      const newHtml = '<div>world</div>'
      editor.setHtml(newHtml)

      expect(editor.getHtml()).toBe(newHtml)
      expect(editor.isFocused()).toBe(false)
    })

    it('setHtml disabled', () => {
      const editor = createEditor({ html: '<div>hello</div>' })
      editor.disable()
      expect(editor.isDisabled()).toBe(true)

      const newHtml = '<div>world</div>'
      editor.setHtml(newHtml)

      expect(editor.getHtml()).toBe(newHtml)
      expect(editor.isDisabled()).toBe(true)
    })
  })
})
