import { IDomEditor } from '@wangeditor/core/src/editor/interface'
import { isMenuDisabled } from '../../../../packages/upload-image-module/src/module/helper'
import createEditor from '../../../utils/create-editor'
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

const fixtures = [
  {
    type: 'code',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'code',
            children: [{ text: '123' }],
          },
        ],
      },
    ],
  },
  {
    type: 'pre',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'pre',
            children: [{ text: '123' }],
          },
        ],
      },
    ],
  },
  {
    type: 'link',
    content: [
      {
        type: 'link',
        children: [{ text: '123' }],
      },
    ],
  },
  {
    type: 'list-item',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'list-item',
            children: [{ text: '123' }],
          },
        ],
      },
    ],
  },
  {
    type: 'header1',
    content: [
      {
        type: 'header1',
        children: [
          {
            text: '123',
          },
        ],
      },
    ],
  },
  {
    type: 'blockquote',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'blockquote',
            children: [{ text: '123' }],
          },
        ],
      },
    ],
  },
]

describe('Upload image helper', () => {
  beforeEach(() => {
    editor = createEditor()
  })

  test('isMenuDisabled should return true if editor selection is null', () => {
    editor.selection = null

    expect(isMenuDisabled(editor)).toBeTruthy()
  })

  test('isMenuDisabled should return true if editor selection is not collapsed', () => {
    setEditorSelection(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 1 },
    })
    expect(isMenuDisabled(editor)).toBeTruthy()
  })

  fixtures.forEach(item => {
    test(`isMenuDisabled should return true if editor selection is contain ${item.type} element`, () => {
      const editor = createEditor({
        content: item.content,
      })
      setEditorSelection(editor)
      expect(isMenuDisabled(editor)).toBeTruthy()
    })
  })

  test('isMenuDisabled should return false if editor selection is contain normal paragraph element', () => {
    const editor = createEditor({
      content: [{ type: 'paragraph', children: [{ text: 'test123' }] }],
    })
    setEditorSelection(editor)
    expect(isMenuDisabled(editor)).toBeFalsy()
  })
})
