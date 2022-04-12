/**
 * @description image helper test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { DomEditor } from '@wangeditor/core'
import createEditor from '../../../../tests/utils/create-editor'
import {
  insertImageNode,
  updateImageNode,
  isInsertImageMenuDisabled,
} from '../../src/modules/image/helper'

describe('image helper', () => {
  let editor: any
  let startLocation: any

  const src = 'https://www.wangeditor.com/imgs/logo.png'
  const alt = 'logo'
  const href = 'https://www.wangeditor.com/'

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('insert image node', async () => {
    editor.select(startLocation)
    await insertImageNode(editor, src, alt, href)
    const images = editor.getElemsByTypePrefix('image')
    expect(images.length).toBe(1)
  })

  it('update image node', async () => {
    editor.select(startLocation)

    const elem = {
      type: 'image',
      src,
      alt,
      href,
      style: { width: '100', height: '80' },
      children: [{ text: '' }], // void node 必须包含一个空 text
    }
    editor.insertNode(elem) // 插入图片
    editor.select({
      path: [0, 1, 0], // 选中图片
      offset: 0,
    })

    const newSrc = 'https://www.baidu.com/logo.png'
    const newAlt = 'baidu'
    const newHref = 'https://www.baidu.com/'
    await updateImageNode(editor, newSrc, newAlt, newHref, {}) // 更新图片信息

    const imageNode = DomEditor.getSelectedNodeByType(editor, 'image')
    expect(imageNode).not.toBeNull()
  })

  it('is menu disable', async () => {
    editor.deselect()
    expect(isInsertImageMenuDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(isInsertImageMenuDisabled(editor)).toBeFalsy()

    editor.insertText('hello')
    editor.select([])
    expect(isInsertImageMenuDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    Transforms.setNodes(editor, { type: 'header1' })
    expect(isInsertImageMenuDisabled(editor)).toBeTruthy()
  })
})
