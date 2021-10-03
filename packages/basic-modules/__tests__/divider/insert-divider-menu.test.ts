/**
 * @description insert divider menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import InsertDividerMenu from '../../src/modules/divider/menu/InsertDividerMenu'

describe('divider plugin', () => {
  const menu = new InsertDividerMenu()
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

  // getValue isActive 无逻辑，不用测试

  it('is disabled', () => {
    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    const elem = { type: 'divider', children: [{ text: '' }] }
    editor.insertNode(elem) // 插入 divider
    editor.select({
      path: [1, 0], // 选中 divider
      offset: 0,
    })
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  it('exec', () => {
    editor.select(startLocation)
    menu.exec(editor, '')

    const dividers = editor.getElemsByTypePrefix('divider')
    expect(dividers.length).toBe(1)
  })
})
