/**
 * @description code-highlight select lang menu test
 * @author wangfupeng
 */

import { IDomEditor } from '@wangeditor/core'
import createEditor from '../../../tests/utils/create-editor'
import { content, codeLocation, paragraphLocation, language } from './content'
import SelectLangMenu from '../src/module/menu/SelectLangMenu'

describe('code-highlight select lang menu', () => {
  let editor: IDomEditor | null = null
  let menu: SelectLangMenu | null = null

  beforeAll(() => {
    // 创建 editor
    editor = createEditor({
      content,
    })

    // 创建 menu
    menu = new SelectLangMenu()
  })

  afterAll(() => {
    // 销毁 editor
    if (editor == null) return
    editor.destroy()
    editor = null

    // 销毁 menu
    menu = null
  })

  it('get langs and selected one', () => {
    if (editor == null || menu == null) throw new Error('editor or menu is null')

    // select codeNode
    editor.select(codeLocation)

    const langs = menu.getOptions(editor)

    // 包括多个 lang
    expect(langs.length).toBeGreaterThan(0)

    // 其中有一个 'plain text'
    const hasPlainText = langs.some(lang => lang.text === 'plain text' && lang.value === '')
    expect(hasPlainText).toBeTruthy()

    // 选中的语言
    const selectedLangs = langs.filter(lang => lang.selected)
    expect(selectedLangs.length).toBe(1)
    const selectedLang: any = selectedLangs[0] || {}
    expect(selectedLang.value).toBe(language)
  })

  it('menu active is always false', () => {
    if (editor == null || menu == null) throw new Error('editor or menu is null')

    expect(menu.isActive(editor)).toBeFalsy()
  })

  it('get menu value (selected lang)', () => {
    if (editor == null || menu == null) throw new Error('editor or menu is null')

    // select codeNode
    editor.select(codeLocation)
    expect(menu.getValue(editor)).toBe(language)

    // select paragraph
    editor.select(paragraphLocation)
    expect(menu.getValue(editor)).toBe('')
  })

  it('menu disable', () => {
    if (editor == null || menu == null) throw new Error('editor or menu is null')

    // deselect
    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()

    // select paragraph
    editor.select(paragraphLocation)
    expect(menu.isDisabled(editor)).toBeTruthy()

    // select codeNode
    editor.select(codeLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()
  })

  it('menu exec (change lang)', done => {
    if (editor == null || menu == null) throw new Error('editor or menu is null')

    // select codeNode
    editor.select(codeLocation)
    menu.exec(editor, 'html') // change lang

    setTimeout(() => {
      if (editor == null || menu == null) return

      editor.select(codeLocation)
      expect(menu.getValue(editor)).toBe('html')
      done()
    })
  })
})
