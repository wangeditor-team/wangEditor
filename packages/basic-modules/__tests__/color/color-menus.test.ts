/**
 * @description color menus test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import ColorMenu from '../../src/modules/color/menu/ColorMenu'
import BgColorMenu from '../../src/modules/color/menu/BgColorMenu'

describe('color menus', () => {
  let editor: any
  let startLocation: any

  const menus = [
    {
      mark: 'color',
      menu: new ColorMenu(),
    },
    {
      mark: 'bgColor',
      menu: new BgColorMenu(),
    },
  ]

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  // exec 无代码，不用测试

  it('getValue and isActive', () => {
    editor.select(startLocation)

    menus.forEach(({ menu }) => {
      expect(menu.getValue(editor)).toBe('')
      expect(menu.isActive(editor)).toBeFalsy()
    })

    editor.insertText('hello') // 插入文字
    editor.select([]) // 全选
    menus.forEach(({ mark, menu }) => {
      editor.addMark(mark, 'rgb(51, 51, 51)') // 添加 color bgColor
      expect(menu.getValue(editor)).toBe('rgb(51, 51, 51)')
      expect(menu.isActive(editor)).toBeTruthy()
    })
  })

  it('is disabled', () => {
    editor.select(startLocation)
    menus.forEach(({ menu }) => {
      expect(menu.isDisabled(editor)).toBeFalsy()
    })

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    menus.forEach(({ menu }) => {
      expect(menu.isDisabled(editor)).toBeTruthy()
    })
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('get panel content elem', () => {
    menus.forEach(({ menu }) => {
      const elem = menu.getPanelContentElem(editor)
      expect(elem instanceof HTMLElement).toBeTruthy()
    })
  })
})
