/**
 * @description link module helper test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import { isMenuDisabled, insertLink, updateLink } from '../../src/modules/link/helper'

describe('link module helper', () => {
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

  it('menu disable', () => {
    editor.deselect()
    expect(isMenuDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(isMenuDisabled(editor)).toBeFalsy()

    editor.insertNode({
      type: 'link',
      url: 'https://www.wangeditor.com/',
      children: [{ text: 'xxx' }],
    })
    expect(isMenuDisabled(editor)).toBeTruthy() // 选中 link ，则禁用

    editor.clear()
    editor.insertNode({
      type: 'pre',
      children: [
        {
          type: 'code',
          children: [{ text: 'var' }],
        },
      ],
    })
    expect(isMenuDisabled(editor)).toBeTruthy() // 选中 code-block ，则禁用
  })

  it('insert link with collapsed selection', async () => {
    editor.select(startLocation)

    const url = 'https://www.wangeditor.com/'
    await insertLink(editor, 'hello', url)

    const links = editor.getElemsByTypePrefix('link')
    expect(links.length).toBe(1)
    const linkElem = links[0]
    expect(linkElem.url).toBe(url)
  })

  it('insert link with expand selection', async () => {
    editor.select(startLocation)
    editor.insertText('hello')
    Transforms.move(editor, {
      distance: 3, // 选中 3 个字母
      unit: 'character',
    })
    editor.select([]) // 全选

    const url = 'https://www.wangeditor.com/'
    await insertLink(editor, 'hello', url)

    const links = editor.getElemsByTypePrefix('link')
    expect(links.length).toBe(1)
    const linkElem = links[0]
    expect(linkElem.url).toBe(url)
  })

  it('update link', async () => {
    editor.select(startLocation)

    const url = 'https://www.wangeditor.com/'
    await insertLink(editor, 'hello', url)

    // 选区移动到 link 内部
    editor.select({
      path: [0, 1, 0],
      offset: 3,
    })

    // 更新链接
    const newUrl = 'https://www.wangeditor.com/123'
    await updateLink(editor, '', newUrl)

    const links = editor.getElemsByTypePrefix('link')
    expect(links.length).toBe(1)
    const linkElem = links[0]
    expect(linkElem.url).toBe(newUrl)
  })
})
