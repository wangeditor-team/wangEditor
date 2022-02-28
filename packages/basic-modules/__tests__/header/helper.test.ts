/**
 * @description header helper test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import { getHeaderType, isMenuDisabled, setHeaderType } from '../../src/modules/header/helper'

describe('header helper', () => {
  let editor: any
  let startLocation: any

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('get header type', () => {
    editor.select(startLocation)
    expect(getHeaderType(editor)).toBe('paragraph')

    Transforms.setNodes(editor, { type: 'header1' })
    expect(getHeaderType(editor)).toBe('header1')
  })

  it('is menu disabled', () => {
    editor.select(startLocation)
    expect(isMenuDisabled(editor)).toBeFalsy()

    Transforms.setNodes(editor, { type: 'header1' })
    expect(isMenuDisabled(editor)).toBeFalsy()

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(isMenuDisabled(editor)).toBeTruthy() // 只能用于 p header
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('set header type', () => {
    editor.select(startLocation)
    setHeaderType(editor, 'header1')

    const headers = editor.getElemsByTypePrefix('header1')
    expect(headers.length).toBe(1)
  })
})
