/**
 * @description unlink menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import UnLink from '../../../src/modules/link/menu/UnLink'

describe('unlink menu test', () => {
  let editor: any
  let startLocation: any
  const menu = new UnLink()

  const linkNode = {
    type: 'link',
    url: 'https://www.wangeditor.com/',
    children: [{ text: 'xxx' }],
  }

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('get value', () => {
    expect(menu.getValue(editor)).toBe('')
  })

  it('is active', () => {
    expect(menu.isActive(editor)).toBe(false)
  })

  it('is disable', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.insertNode(linkNode)
    editor.select({
      path: [0, 1, 0], // 选区定位到 link 内部
      offset: 1,
    })
    expect(menu.isDisabled(editor)).toBeFalsy()
  })

  it('exec', () => {
    editor.select(startLocation)
    editor.insertNode(linkNode)
    editor.select({
      path: [0, 1, 0], // 选区定位到 link 内部
      offset: 1,
    })

    menu.exec(editor, '')
    const links = editor.getElemsByTypePrefix('link')
    expect(links.length).toBe(0)
  })
})
