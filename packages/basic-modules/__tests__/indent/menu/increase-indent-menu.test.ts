/**
 * @description increase indent menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import IncreaseIndentMenu from '../../../src/modules/indent/menu/IncreaseIndentMenu'

describe('increase indent menu', () => {
  let editor: any
  let startLocation: any

  const menu = new IncreaseIndentMenu()

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
    expect(menu.isDisabled(editor)).toBeFalsy()

    Transforms.setNodes(editor, { type: 'header1', children: [] })
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(menu.isDisabled(editor)).toBeTruthy() // 除了 p header 之外，其他 type 不可用 indent
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  // isActive 不用测试

  it('exec and getValue', () => {
    editor.select(startLocation)
    expect(menu.getValue(editor)).toBe('')

    menu.exec(editor, '')
    expect(menu.getValue(editor)).toBe('2em')
  })

  it('indent value', () => {
    editor.insertNode({
      type: 'paragraph',
      children: [{ fontSize: '18px', text: 'text1' } as any],
    })

    menu.exec(editor, '')

    expect(menu.getValue(editor)).toBe('36px')
  })
})
