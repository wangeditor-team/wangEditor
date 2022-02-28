/**
 * @description insert image menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import InsertImage from '../../../src/modules/image/menu/InsertImage'

describe('insert image menu', () => {
  const menu = new InsertImage()
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

  // getValue isActive exec 无逻辑，不用测试

  it('is disabled', () => {
    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.insertText('xxx')
    editor.select([]) // 全选文字
    expect(menu.isDisabled(editor)).toBeTruthy() // 非折叠选区，则不可用

    editor.select(startLocation)
    Transforms.setNodes(editor, { type: 'header1' })
    expect(menu.isDisabled(editor)).toBeTruthy() // header 中不可用

    Transforms.setNodes(editor, { type: 'blockquote' })
    expect(menu.isDisabled(editor)).toBeTruthy() // blockquote 中不可用
  })

  // getModalPositionNode 无逻辑，不用测试

  it('get modal content elem', () => {
    const elem = menu.getModalContentElem(editor)
    expect(elem.tagName).toBe('DIV')

    // insertImage 在 helper.test.ts 中测试
  })
})
