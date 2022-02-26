/**
 * @description emotion menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import EmotionMenu from '../../src/modules/emotion/menu/EmotionMenu'

describe('font family menu', () => {
  const menu = new EmotionMenu()
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

  // exec getValue isActive 无代码逻辑，不用测试

  it('is disabled', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(menu.isDisabled(editor)).toBeTruthy()
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('get panel content elem', () => {
    const elem = menu.getPanelContentElem(editor)
    expect(elem instanceof HTMLElement).toBeTruthy()
  })
})
