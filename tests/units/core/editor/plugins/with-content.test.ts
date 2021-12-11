import { IDomEditor } from '../../../../../packages/core/src/editor/interface'
import createEditor from '../../../../utils/create-editor'
import * as slate from 'slate'

let editor: IDomEditor

function setEditorSelection(
  editor: IDomEditor,
  selection: slate.Selection = {
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

describe('Editor plugins with-content', () => {
  describe('With-content dangerouslyInsertHtml api', () => {
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
      const htmlString = '<a href="https://www.wangeditor.com/v5/" target="_blank">wangEditor</a>'
      editor.dangerouslyInsertHtml(htmlString)

      expect(editor.children).toEqual([
        {
          type: 'paragraph',
          children: [
            { text: '' },
            {
              type: 'link',
              children: [{ text: 'wangEditor' }],
              url: 'https://www.wangeditor.com/v5/',
              target: '_blank',
            },
            { text: ' ' },
          ],
        },
      ])
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
