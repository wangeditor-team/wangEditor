/**
 * @description header select menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import HeaderSelectMenu from '../../../src/modules/header/menu/HeaderSelectMenu'

describe('header select menu', () => {
  const editor = createEditor()
  const startLocation = Editor.start(editor, [])
  const menu = new HeaderSelectMenu()

  it('get options', () => {
    editor.select(startLocation)
    const options1 = menu.getOptions(editor)
    const selectedP = options1.some(opt => opt.selected && opt.value === 'paragraph') // 选中“文本”
    expect(selectedP).toBeTruthy()

    Transforms.setNodes(editor, { type: 'header1' })
    const options2 = menu.getOptions(editor)
    const selectedHeader = options2.some(opt => opt.selected && opt.value === 'header1') // 选中“h1”
    expect(selectedHeader).toBeTruthy()
  })

  // isActive 无逻辑，不用测试

  // getValue isDisabled exec 已经在 helper.test.ts 中测试过了
})
