/**
 * @description numberedList menu test
 * @author luochao
 */

import NumberedListMenu from '../../../../packages/list-module/src/module/menu/NumberedListMenu'
import createEditor from '../../../../tests/utils/create-editor'
import * as core from '@wangeditor/core'
import * as slate from 'slate'

describe('Module Menu', () => {
  const numberedListMenu = new NumberedListMenu()
  const editor = createEditor()

  test('NumberedListMenu should implement type, title, svgIcon property', () => {
    expect(numberedListMenu.type).toBe('numbered-list')
    expect(numberedListMenu.title).toBe('有序列表')
    expect(numberedListMenu.iconSvg).toBe(
      '<svg viewBox="0 0 1024 1024"><path d="M384 832h640v128H384z m0-384h640v128H384z m0-384h640v128H384zM192 0v256H128V64H64V0zM128 526.016v50.016h128v64H64v-146.016l128-60V384H64v-64h192v146.016zM256 704v320H64v-64h128v-64H64v-64h128v-64H64v-64z"></path></svg>'
    )
  })

  test('NumberedListMenu invoke getValue should return ""', () => {
    expect(numberedListMenu.getValue(editor)).toBe('')
  })

  test('NumberedListMenu invoke isActive should return true if selected node is list node', () => {
    jest
      .spyOn(core.DomEditor, 'getSelectedNodeByType')
      .mockReturnValue({ type: 'numbered-list', children: [] })
    expect(numberedListMenu.isActive(editor)).toBe(true)
  })

  test('NumberedListMenu invoke isActive should return true if selected node is not list node', () => {
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)
    expect(numberedListMenu.isActive(editor)).toBe(false)
  })

  test('NumberedListMenu invoke isDisabled should return true if editor selection is null', () => {
    editor.selection = null
    expect(numberedListMenu.isDisabled(editor)).toBe(true)
  })

  test('NumberedListMenu invoke isDisabled should return true if selected node is table, pre or void element', () => {
    const editor = createEditor()
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }
    const fn = function* () {
      yield [
        {
          type: 'table',
          children: [],
        },
        [0, 1],
      ] as slate.NodeEntry<unknown>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    expect(numberedListMenu.isDisabled(editor)).toBe(true)
  })
  test('NumberedListMenu invoke isDisabled should return false if selected node is not table, pre or void element', () => {
    const editor = createEditor()
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }
    const fn = function* () {
      yield null as unknown as slate.NodeEntry<unknown>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    expect(numberedListMenu.isDisabled(editor)).toBe(false)
  })

  test('NumberedListMenu invoke exec should set current select node to list-item if list menu is not active', () => {
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'setNodes').mockImplementation(mockFn)

    numberedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'list-item' })
  })

  test('NumberedListMenu invoke exec should set current select node to paragraph if list menu is not active', () => {
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'wrapNodes').mockImplementation(mockFn)

    numberedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'numbered-list', children: [] })
  })

  test('NumberedListMenu invoke exec should set current select node to paragraph if list menu is active', () => {
    jest
      .spyOn(core.DomEditor, 'getSelectedNodeByType')
      .mockReturnValue({ type: 'numbered-list', children: [] })

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'setNodes').mockImplementation(mockFn)

    numberedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'paragraph' })
  })

  test('NumberedListMenu invoke exec should set current select node that is list type to other list type', () => {
    const fn = function* () {
      yield [
        {
          type: 'bulleted-list',
          children: [],
        },
        [0, 1],
      ] as slate.NodeEntry<unknown>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'wrapNodes').mockImplementation(mockFn)

    numberedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'numbered-list', children: [] })
  })
})
