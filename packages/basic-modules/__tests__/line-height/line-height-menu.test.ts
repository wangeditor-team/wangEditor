/**
 * @description line-height menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import LineHeightMenu from '../../src/modules/line-height/menu/LineHeightMenu'

describe('line-height menu', () => {
  let editor: any
  let startLocation: any
  const menu = new LineHeightMenu()

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

    const options = menu.getOptions(editor)
    expect(options.length).toBeGreaterThan(0)

    // 默认选中 空
    const selectedEmptyOne = options.some(opt => opt.value === '' && opt.selected)
    expect(selectedEmptyOne).toBe(true)
  })

  // isActive 返回 false ，不用测试

  it('get value', () => {
    editor.select(startLocation)
    expect(menu.getValue(editor)).toBe('')

    // 设置 lineHeight
    Transforms.setNodes(editor, { lineHeight: '1.5' }, { mode: 'highest' })
    expect(menu.getValue(editor)).toBe('1.5')
  })

  it('is disable', () => {
    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    Transforms.setNodes(editor, { type: 'header1' })
    expect(menu.isDisabled(editor)).toBeFalsy()
    Transforms.setNodes(editor, { type: 'blockquote' })
    expect(menu.isDisabled(editor)).toBeFalsy()
    Transforms.setNodes(editor, { type: 'list-item' })
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(menu.isDisabled(editor)).toBeTruthy()
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('exec', () => {
    editor.select(startLocation)
    menu.exec(editor, '1.5')
    expect(menu.getValue(editor)).toBe('1.5')
  })
})
