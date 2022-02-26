/**
 * @description insert link menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import InsertLinkMenu from '../../../src/modules/link/menu/InsertLink'

describe('insert link menu', () => {
  const editor = createEditor()
  const menu = new InsertLinkMenu()
  const startLocation = Editor.start(editor, [])

  afterEach(() => {
    editor.select(startLocation)
    editor.clear()
    editor.deselect()
  })

  it('get value', () => {
    expect(menu.getValue(editor)).toBe('')
  })

  it('is active', () => {
    expect(menu.isActive(editor)).toBeFalsy()
  })

  it('get modal position node', () => {
    expect(menu.getModalPositionNode(editor)).toBeNull()
  })

  it('is disable', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()
  })

  it('get modal content elem', () => {
    const elem = menu.getModalContentElem(editor)
    expect(elem.tagName).toBe('DIV')
  })
})
