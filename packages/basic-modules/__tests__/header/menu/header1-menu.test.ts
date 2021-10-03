/**
 * @description header1 menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import Header1ButtonMenu from '../../../src/modules/header/menu/Header1ButtonMenu'

describe('header1 menu', () => {
  const editor = createEditor()
  const startLocation = Editor.start(editor, [])
  const menu = new Header1ButtonMenu()

  // getValue isActive isDisabled 在 helper.test.ts 中已经测试过

  it('exec', () => {
    editor.select(startLocation)

    menu.exec(editor, 'paragraph') // 设置 header （ paragraph 是当前选中的 node type ）
    const headers1 = editor.getElemsByTypePrefix('header1')
    expect(headers1.length).toBe(1)

    menu.exec(editor, 'header1') // 取消 header（ header1 是当前选中的 node type ）
    const headers2 = editor.getElemsByTypePrefix('header1')
    expect(headers2.length).toBe(0)
  })
})
