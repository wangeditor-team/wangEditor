/**
 * @description bulletedList menu test
 * @author luochao
 */

import BulletedListMenu from '@wangeditor/list-module/src/module/menu/BulletedListMenu'
import createEditor from '../../../utils/create-editor'
import * as core from '@wangeditor/core'
import * as slate from 'slate'

describe('Module BaseMenu', () => {
  const bulletedListMenu = new BulletedListMenu()
  const editor = createEditor()

  test('BulletedListMenu should implement type, title, svgIcon property', () => {
    expect(bulletedListMenu.type).toBe('bulleted-list')
    expect(bulletedListMenu.title).toBe('无序列表')
    expect(bulletedListMenu.iconSvg).toBe(
      '<svg viewBox="0 0 1024 1024"><path d="M384 64h640v128H384V64z m0 384h640v128H384v-128z m0 384h640v128H384v-128zM0 128a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m0 384a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m0 384a128 128 0 1 1 256 0 128 128 0 0 1-256 0z"></path></svg>'
    )
  })

  test('BulletedListMenu invoke getValue should return ""', () => {
    expect(bulletedListMenu.getValue(editor)).toBe('')
  })

  test('BulletedListMenu invoke isActive should return true if selected node is list node', () => {
    jest
      .spyOn(core.DomEditor, 'getSelectedNodeByType')
      .mockReturnValue({ type: 'bulleted-list', children: [] } as slate.Element)
    expect(bulletedListMenu.isActive(editor)).toBe(true)
  })

  test('BulletedListMenu invoke isActive should return true if selected node is not list node', () => {
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)
    expect(bulletedListMenu.isActive(editor)).toBe(false)
  })

  test('BulletedListMenu invoke isDisabled should return true if editor selection is null', () => {
    editor.selection = null
    expect(bulletedListMenu.isDisabled(editor)).toBe(true)
  })

  test('BulletedListMenu invoke isDisabled should return true if selected node is table, pre or void element', () => {
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
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())
    expect(bulletedListMenu.isDisabled(editor)).toBe(true)
  })
  test('BulletedListMenu invoke isDisabled should return false if selected node is not table, pre or void element', () => {
    const editor = createEditor()
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }
    // const fn = function* () {
    //   yield null as unknown as slate.NodeEntry<unknown>
    // }
    // jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())

    const fn = function () {
      return false
    }
    jest.spyOn(slate.Editor, 'isVoid').mockReturnValue(fn())
    jest.spyOn(slate.Editor, 'isBlock').mockReturnValue(fn())

    expect(bulletedListMenu.isDisabled(editor)).toBe(false)
  })

  test('BulletedListMenu invoke exec should set current select node to list-item if list menu is not active', () => {
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'setNodes').mockImplementation(mockFn)

    bulletedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'list-item' })
  })

  test('BulletedListMenu invoke exec should set current select node to paragraph if list menu is not active', () => {
    jest.spyOn(core.DomEditor, 'getSelectedNodeByType').mockReturnValue(null)

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'wrapNodes').mockImplementation(mockFn)

    bulletedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'bulleted-list', children: [] })
  })

  test('BulletedListMenu invoke exec should set current select node to paragraph if list menu is active', () => {
    jest
      .spyOn(core.DomEditor, 'getSelectedNodeByType')
      .mockReturnValue({ type: 'bulleted-list', children: [] } as slate.Element)

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'setNodes').mockImplementation(mockFn)

    bulletedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'paragraph' })
  })

  test('BulletedListMenu invoke exec should set current select node that is list type to other list type', () => {
    const fn = function* () {
      yield [
        {
          type: 'numbered-list',
          children: [],
        } as slate.Element,
        [0, 1],
      ] as slate.NodeEntry<slate.Element>
    }
    jest.spyOn(slate.Editor, 'nodes').mockReturnValue(fn())

    const mockFn = jest.fn()
    jest.spyOn(slate.Transforms, 'wrapNodes').mockImplementation(mockFn)

    bulletedListMenu.exec(editor, '')
    expect(mockFn).toBeCalledWith(editor, { type: 'bulleted-list', children: [] })
  })
})
