/**
 * @description decrease indent menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import DecreaseIndentMenu from '../../../../../packages/basic-modules/src/modules/indent/menu/DecreaseIndentMenu'

describe('decrease indent menu', () => {
  let editor: any
  let startLocation: any

  const menu = new DecreaseIndentMenu()

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('is disabled', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeTruthy() // 没有 indent 则 disabled

    Transforms.setNodes(editor, { type: 'header1' })
    expect(menu.isDisabled(editor)).toBeTruthy() // 没有 indent 则 disabled

    Transforms.setNodes(editor, { type: 'pre' }) // 除了 p header 之外，其他 type 不可用 indent
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  // isActive 不用测试

  // getValue 在 increase menu 已测试过

  it('exec', () => {
    editor.select(startLocation)
    Transforms.setNodes(editor, { indent: '64px' })

    expect(menu.isDisabled(editor)).toBeFalsy() // 有 indent 则取消 disabled

    menu.exec(editor, '64px')
    expect(menu.getValue(editor)).toBe('32px') // 64 - 32
  })
})
