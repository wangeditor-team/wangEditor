/**
 * @description edit link menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import EditLink from '../../../src/modules/link/menu/EditLink'

describe('edit link menu', () => {
  let editor: any
  let startLocation: any
  const menu = new EditLink()

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
    expect(menu.isActive(editor)).toBeFalsy()
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

  it('get modal position node', () => {
    editor.select(startLocation)
    expect(menu.getModalPositionNode(editor)).toBeNull()

    editor.insertNode(linkNode)
    editor.select({
      path: [0, 1, 0], // 选区定位到 link 内部
      offset: 1,
    })
    const node = menu.getModalPositionNode(editor) as any
    expect(node.type).toBe('link')
    expect(node.url).toBe(linkNode.url)
  })

  it('get modal content elem', () => {
    editor.select(startLocation)
    const elem = menu.getModalContentElem(editor)
    expect(elem.tagName).toBe('DIV')
  })
})
