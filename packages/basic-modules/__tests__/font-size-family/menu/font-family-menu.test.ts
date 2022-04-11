/**
 * @description font family menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import FontFamilyMenu from '../../../src/modules/font-size-family/menu/FontFamilyMenu'

describe('font family menu', () => {
  const menu = new FontFamilyMenu()
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

  it('get options', () => {
    editor.select(startLocation)
    const options1 = menu.getOptions(editor)
    const selectedDefault = options1.some(opt => opt.selected && opt.value === '')
    expect(selectedDefault).toBeTruthy() // 空白 p ，选中“默认”

    editor.insertText('hello')
    editor.select([]) // 全选
    editor.addMark('fontFamily', '黑体') // 设置字体
    const options2 = menu.getOptions(editor)
    const selectedHeiti = options2.some(opt => opt.selected && opt.value === '黑体')
    expect(selectedHeiti).toBeTruthy()
  })

  // isActive 无代码逻辑，不用测试

  it('is disabled', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(menu.isDisabled(editor)).toBeTruthy()
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('exec and getValue', () => {
    editor.select(startLocation)
    expect(menu.getValue(editor)).toBe('')

    editor.insertText('hello')
    editor.select([]) // 全选
    menu.exec(editor, '黑体') // 设置字体
    expect(menu.getValue(editor)).toBe('黑体')

    menu.exec(editor, '') // 取消字体
    expect(menu.getValue(editor)).toBe('')
  })
})
