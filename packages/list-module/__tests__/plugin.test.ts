/**
 * @description list menu test
 * @author luochao
 */

import withList from '../src/module/plugin'
import createEditor from '../../../tests/utils/create-editor'
import * as core from '@wangeditor/core'
import * as slate from 'slate'

describe('module plugin', () => {
  test('Use withList editor invoke insertBreak should insert empty if current selectNode is list last child and content is empty', () => {
    const editor = createEditor({
      content: [
        {
          type: 'numbered-list',
          children: [
            {
              type: 'list-item',
              children: [{ text: 'hello' }],
            },
            {
              type: 'list-item',
              children: [{ text: '' }],
            },
          ],
        },
      ],
    })
    editor.select({ path: [0, 1, 0], offset: 0 }) // 选中第二个 list-item

    const newEditor = withList(editor)
    newEditor.insertBreak() // 回车换行

    const listItems = newEditor.getElemsByType('list-item')
    expect(listItems.length).toBe(1) // list-item 变为一个

    const paragraphs = newEditor.getElemsByType('paragraph')
    expect(paragraphs.length).toBe(1) // 生成一个 paragraph
  })

  test('Use withList editor invoke original insertBreak if current selectNode is not list', () => {
    const editor = createEditor()
    const mockInsertBreakFn = jest.fn()
    editor.insertBreak = mockInsertBreakFn

    const newEditor = withList(editor)
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)
    newEditor.insertBreak()

    expect(mockInsertBreakFn).toBeCalled()
  })

  test('Use withList editor invoke deleteBackward should execute original deleteBackward if current selected nodes is null', () => {
    const editor = createEditor()
    const mockDeleteBackwardFn = jest.fn()
    editor.deleteBackward = mockDeleteBackwardFn

    const newEditor = withList(editor)
    const fn = function* a() {
      yield [null] as unknown as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())

    newEditor.deleteBackward('word')

    expect(mockDeleteBackwardFn).toBeCalled()
  })

  test('Use withList editor invoke deleteBackward should execute original deleteBackward if current selected nodes is invalid element', () => {
    const editor = createEditor()
    const mockDeleteBackwardFn = jest.fn()
    editor.deleteBackward = mockDeleteBackwardFn

    const newEditor = withList(editor)
    const fn = function* a() {
      yield [
        {
          type: 'paragraph',
          children: [],
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())

    newEditor.deleteBackward('word')

    expect(mockDeleteBackwardFn).toBeCalled()
  })

  test('Use withList editor invoke deleteBackward should execute original deleteBackward if current selected nodes is not list type', () => {
    const editor = createEditor()
    const mockDeleteBackwardFn = jest.fn()
    editor.deleteBackward = mockDeleteBackwardFn

    const newEditor = withList(editor)
    const fn = function* a() {
      yield [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())

    newEditor.deleteBackward('word')

    expect(mockDeleteBackwardFn).toBeCalled()
  })

  test('Use withList editor invoke deleteBackward should unwrap empty list and replace it to paragraph node', () => {
    const editor = createEditor()

    const newEditor = withList(editor)
    const fn = function* a() {
      yield [
        {
          type: 'bulleted-list',
          children: [{ text: '' }],
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    const mock = jest.spyOn(slate.Transforms, 'setNodes')

    newEditor.deleteBackward('word')

    expect(mock).toBeCalled()
  })
})
