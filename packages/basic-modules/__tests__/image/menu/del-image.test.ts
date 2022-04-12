/**
 * @description delete image menu test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import DeleteImage from '../../../src/modules/image/menu/DeleteImage'

describe('delete image menu', () => {
  const menu = new DeleteImage()
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

  // getValue isActive 无逻辑，不用测试

  it('is disabled', () => {
    editor.deselect()
    expect(menu.isDisabled(editor)).toBeTruthy()

    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeTruthy()

    const elem = {
      type: 'image',
      src,
      alt,
      href,
      children: [{ text: '' }], // void node 必须包含一个空 text
    }
    editor.insertNode(elem) // 插入图片
    editor.select({
      path: [0, 1, 0], // 选中图片
      offset: 0,
    })
    expect(menu.isDisabled(editor)).toBeFalsy()
  })

  it('exec', () => {
    editor.select(startLocation)
    const elem = {
      type: 'image',
      src,
      alt,
      href,
      children: [{ text: '' }], // void node 必须包含一个空 text
    }
    editor.insertNode(elem) // 插入图片
    editor.select({
      path: [0, 1, 0], // 选中图片
      offset: 0,
    })

    menu.exec(editor, '')
    const images = editor.getElemsByTypePrefix('image')
    expect(images.length).toBe(0)
  })
})
