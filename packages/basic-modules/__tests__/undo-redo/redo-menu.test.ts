/**
 * @description redo menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import RedoMenu from '../../src/modules/undo-redo/menu/RedoMenu'

describe('redo menu', () => {
  const editor = createEditor()
  const menu = new RedoMenu()
  const location = Editor.start(editor, []) // 选区位置

  it('tag', () => {
    expect(menu.tag).toBe('button')
  })

  it('get value', () => {
    expect(menu.getValue(editor)).toBe('')
  })

  it('is active', () => {
    expect(menu.isActive(editor)).toBeFalsy()
  })

  it('is disable', () => {
    // 有选区
    editor.select(location)
    expect(menu.isDisabled(editor)).toBeFalsy()

    // 无选区
    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  it('exec', () => {
    const text = editor.getText()

    editor.select(location)
    editor.insertText('xxx')
    if (typeof editor.undo === 'function') {
      editor.undo()
    }
    menu.exec(editor, '')

    const newText = editor.getText()
    expect(newText).toBe(text + 'xxx')
  })
})
