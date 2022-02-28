/**
 * @description justify menus test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import JustifyCenterMenu from '../../src/modules/justify/menu/JustifyCenterMenu'
import JustifyJustifyMenu from '../../src/modules/justify/menu/JustifyJustifyMenu'
import JustifyLeftMenu from '../../src/modules/justify/menu/JustifyLeftMenu'
import JustifyRightMenu from '../../src/modules/justify/menu/JustifyRightMenu'

describe('justify menus', () => {
  let editor: any
  let startLocation: any

  const centerMenu = new JustifyCenterMenu()
  const justifyMenu = new JustifyJustifyMenu()
  const leftMenu = new JustifyLeftMenu()
  const rightMenu = new JustifyRightMenu()

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  // getValue getActive 不需要测试

  it('is disabled', () => {
    editor.deselect()
    expect(centerMenu.isDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(centerMenu.isDisabled(editor)).toBeFalsy()

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(centerMenu.isDisabled(editor)).toBeTruthy()
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('exec', () => {
    editor.select(startLocation)

    centerMenu.exec(editor, '')
    const p1 = editor.getElemsByTypePrefix('paragraph')[0]
    expect(p1.textAlign).toBe('center')

    justifyMenu.exec(editor, '')
    const p2 = editor.getElemsByTypePrefix('paragraph')[0]
    expect(p2.textAlign).toBe('justify')

    leftMenu.exec(editor, '')
    const p3 = editor.getElemsByTypePrefix('paragraph')[0]
    expect(p3.textAlign).toBe('left')

    rightMenu.exec(editor, '')
    const p4 = editor.getElemsByTypePrefix('paragraph')[0]
    expect(p4.textAlign).toBe('right')
  })
})
