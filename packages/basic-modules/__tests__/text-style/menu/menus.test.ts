/**
 * @description style menus test
 * @author wangfupeng
 */

import { Editor, Transforms, Element } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import BoldMenu from '../../../src/modules/text-style/menu/BoldMenu'
import CodeMenu from '../../../src/modules/text-style/menu/CodeMenu'
import ItalicMenu from '../../../src/modules/text-style/menu/ItalicMenu'
import SubMenu from '../../../src/modules/text-style/menu/SubMenu'
import SupMenu from '../../../src/modules/text-style/menu/SupMenu'
import ThroughMenu from '../../../src/modules/text-style/menu/ThroughMenu'
import UnderlineMenu from '../../../src/modules/text-style/menu/UnderlineMenu'

const MENU_INFO_LIST = [
  { mark: 'bold', menu: new BoldMenu() },
  { mark: 'code', menu: new CodeMenu() },
  { mark: 'italic', menu: new ItalicMenu() },
  { mark: 'sub', menu: new SubMenu() },
  { mark: 'sup', menu: new SupMenu() },
  { mark: 'through', menu: new ThroughMenu() },
  { mark: 'underline', menu: new UnderlineMenu() },
]

describe('text style menus', () => {
  let editor = createEditor()
  const startLocation = Editor.start(editor, [])

  afterEach(() => {
    editor.select(startLocation)
    editor.clear()
  })

  // getValue 已经被 isActive 覆盖

  it('is active', () => {
    MENU_INFO_LIST.forEach(info => {
      const { mark, menu } = info

      editor.select(startLocation)
      editor.clear()
      editor.insertText('hello')
      expect(menu.isActive(editor)).toBeFalsy()

      editor.select([])
      editor.addMark(mark, true)
      expect(menu.isActive(editor)).toBeTruthy()
    })
  })

  it('is disable', () => {
    MENU_INFO_LIST.forEach(info => {
      const { mark, menu } = info

      editor.select(startLocation)
      editor.clear()
      editor.insertText('hello')
      expect(menu.isDisabled(editor)).toBeFalsy() // 正常文字，不禁用

      editor.insertNode({
        type: 'pre',
        children: [
          {
            type: 'code',
            children: [{ text: 'var' }],
          } as Element,
        ],
      } as Element)
      expect(menu.isDisabled(editor)).toBeTruthy() // 选中代码块，禁用各个 menu
    })
  })

  it('exec', () => {
    MENU_INFO_LIST.forEach(info => {
      const { mark, menu } = info

      editor.select(startLocation)
      editor.clear()
      editor.insertText('hello')
      editor.select([])

      // 增加 mark
      menu.exec(editor, false)
      const marks1 = Editor.marks(editor) as any
      expect(marks1[mark]).toBeTruthy()

      // 取消 mark
      editor.select([])
      menu.exec(editor, true)
      const marks2 = Editor.marks(editor) as any
      expect(marks2[mark]).toBeUndefined()
    })
  })
})
