/**
 * @description blockquote menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import BlockquoteMenu from '../../src/modules/blockquote/menu/BlockquoteMenu'

describe('blockquote menu', () => {
  let editor: any
  let startLocation: any
  const menu = new BlockquoteMenu()

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  // getValue 无逻辑，不用测试

  it('is disabled', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    Transforms.setNodes(editor, { type: 'blockquote' })
    expect(menu.isDisabled(editor)).toBeFalsy()

    Transforms.setNodes(editor, { type: 'header1' })
    expect(menu.isDisabled(editor)).toBeTruthy() // 非 p blockquote ，则禁用
  })

  it('exec and isActive', () => {
    editor.select(startLocation)

    menu.exec(editor, '') // 转换为 blockquote
    const blockquotes1 = editor.getElemsByTypePrefix('blockquote')
    expect(blockquotes1.length).toBe(1)
    expect(menu.isActive(editor)).toBeTruthy()

    menu.exec(editor, '') // 取消 blockquote
    const blockquotes2 = editor.getElemsByTypePrefix('blockquote')
    expect(blockquotes2.length).toBe(0)
    expect(menu.isActive(editor)).toBeFalsy()
  })
})
