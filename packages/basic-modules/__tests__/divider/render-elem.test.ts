/**
 * @description divider - render elem test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import { renderDividerConf } from '../../src/modules/divider/render-elem'

describe('divider - render elem test', () => {
  const editor = createEditor()
  const startLocation = Editor.start(editor, [])

  it('render divider elem', () => {
    expect(renderDividerConf.type).toBe('divider')

    const elem = { type: 'divider', children: [{ text: '' }] }
    const vnode1 = renderDividerConf.renderElem(elem, null, editor) as any
    expect(vnode1.sel).toBe('div')
    expect(vnode1.data.props.className).toBe('w-e-textarea-divider')
    expect(vnode1.data.dataset.selected).toBe('') // 未选中
    expect(vnode1.children[0].sel).toBe('hr')

    editor.select(startLocation)
    editor.insertNode(elem) // 插入 divider
    editor.select({
      path: [1, 0], // 选中 divider
      offset: 0,
    })
    const vnode2 = renderDividerConf.renderElem(elem, null, editor) as any
    expect(vnode2.data.dataset.selected).toBe('true') // 选中
  })
})
