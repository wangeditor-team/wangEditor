/**
 * @description header1 menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import Header1ButtonMenu from '../../../src/modules/header/menu/Header1ButtonMenu'
import Header2ButtonMenu from '../../../src/modules/header/menu/Header2ButtonMenu'
import Header3ButtonMenu from '../../../src/modules/header/menu/Header3ButtonMenu'
import Header4ButtonMenu from '../../../src/modules/header/menu/Header4ButtonMenu'
import Header5ButtonMenu from '../../../src/modules/header/menu/Header5ButtonMenu'

describe('header menu', () => {
  const editor = createEditor()
  const startLocation = Editor.start(editor, [])

  describe('header1 menu', () => {
    const menu = new Header1ButtonMenu()

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

  describe('header2 menu', () => {
    const menu = new Header2ButtonMenu()

    it('exec', () => {
      editor.select(startLocation)

      menu.exec(editor, 'paragraph') // 设置 header （ paragraph 是当前选中的 node type ）
      const headers1 = editor.getElemsByTypePrefix('header2')
      expect(headers1.length).toBe(1)

      menu.exec(editor, 'header2') // 取消 header（ header2 是当前选中的 node type ）
      const headers2 = editor.getElemsByTypePrefix('header2')
      expect(headers2.length).toBe(0)
    })
  })

  describe('header3 menu', () => {
    const menu = new Header3ButtonMenu()

    it('exec', () => {
      editor.select(startLocation)

      menu.exec(editor, 'paragraph') // 设置 header （ paragraph 是当前选中的 node type ）
      const headers1 = editor.getElemsByTypePrefix('header3')
      expect(headers1.length).toBe(1)

      menu.exec(editor, 'header3') // 取消 header（ header3 是当前选中的 node type ）
      const headers2 = editor.getElemsByTypePrefix('header3')
      expect(headers2.length).toBe(0)
    })
  })

  describe('header4 menu', () => {
    const menu = new Header4ButtonMenu()

    it('exec', () => {
      editor.select(startLocation)

      menu.exec(editor, 'paragraph') // 设置 header （ paragraph 是当前选中的 node type ）
      const headers1 = editor.getElemsByTypePrefix('header4')
      expect(headers1.length).toBe(1)

      menu.exec(editor, 'header4') // 取消 header（ header4 是当前选中的 node type ）
      const headers2 = editor.getElemsByTypePrefix('header4')
      expect(headers2.length).toBe(0)
    })
  })

  describe('header5 menu', () => {
    const menu = new Header5ButtonMenu()

    it('exec', () => {
      editor.select(startLocation)

      menu.exec(editor, 'paragraph') // 设置 header （ paragraph 是当前选中的 node type ）
      const headers1 = editor.getElemsByTypePrefix('header5')
      expect(headers1.length).toBe(1)

      menu.exec(editor, 'header5') // 取消 header（ header5 是当前选中的 node type ）
      const headers2 = editor.getElemsByTypePrefix('header5')
      expect(headers2.length).toBe(0)
    })
  })
})
