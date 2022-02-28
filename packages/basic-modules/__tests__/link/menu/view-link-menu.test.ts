/**
 * @description view link menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import ViewLink from '../../../src/modules/link/menu/ViewLink'

describe('view link menu', () => {
  let editor: any
  let startLocation: any
  const menu = new ViewLink()

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
    editor.select(startLocation)
    expect(menu.getValue(editor)).toBe('')

    editor.insertNode(linkNode)
    editor.select({
      path: [0, 1, 0], // 选区定位到 link 内部
      offset: 1,
    })
    expect(menu.getValue(editor)).toBe(linkNode.url)
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
})
