/**
 * @description image - render elem test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import { renderImageConf } from '../../src/modules/image/render-elem'
import createEditor from '../../../../tests/utils/create-editor'

describe('image render elem', () => {
  let editor: any
  let startLocation: any

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor.clear()
    editor.destroy()
    editor = null
    startLocation = null
  })

  it('render image - unselected image', () => {
    expect(renderImageConf.type).toBe('image')

    const src = 'https://www.wangeditor.com/imgs/logo.png'
    const href = 'https://www.wangeditor.com/'
    const elem = {
      type: 'image',
      src,
      alt: 'logo',
      href,
      style: { width: '100', height: '80' },
      children: [{ text: '' }], // void node 必须包含一个空 text
    }

    const containerVnode = renderImageConf.renderElem(elem, null, editor) as any
    expect(containerVnode.sel).toBe('div')
    expect(containerVnode.data.className).toBe('w-e-image-container')
    expect(containerVnode.data.style.width).toBe('100')
    expect(containerVnode.data.style.height).toBe('80')

    const imageVnode = containerVnode.children[0] as any
    expect(imageVnode.sel).toBe('img')
    expect(imageVnode.data.src).toBe(src)
    expect(imageVnode.data['data-href']).toBe(href)
  })

  it('render image - selected image', () => {
    const src = 'https://www.wangeditor.com/imgs/logo.png'
    const href = 'https://www.wangeditor.com/'
    const elem = {
      type: 'image',
      src,
      alt: 'logo',
      href,
      style: { width: '100', height: '80' },
      children: [{ text: '' }], // void node 必须包含一个空 text
    }

    editor.select(startLocation)
    editor.insertNode(elem) // 插入图片
    editor.select({
      path: [0, 1, 0], // 选中图片
      offset: 0,
    })

    const containerVnode = renderImageConf.renderElem(elem, null, editor) as any
    expect(containerVnode.sel).toBe('div')
    expect(containerVnode.data.className.indexOf('w-e-selected-image-container')).toBeGreaterThan(0)
    expect(containerVnode.children.length).toBe(5) // image + 4 个拖拽触手
  })
})
