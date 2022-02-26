/**
 * @description todo render elem
 * @author wangfupeng
 */

import createEditor from '../../../../tests/utils/create-editor'
import { renderTodoConf } from '../../src/modules/todo/render-elem'

describe('todo - render elem', () => {
  const editor = createEditor()

  it('render elem', () => {
    expect(renderTodoConf.type).toBe('todo')

    const todo = { type: 'todo', checked: true, children: [{ text: '' }] }
    const vnode = renderTodoConf.renderElem(todo, null, editor) as any
    expect(vnode.sel).toBe('div')
    expect(vnode.children.length).toBe(2)

    const spanForInput = vnode.children[0]
    expect(spanForInput.sel).toBe('span')
    expect(spanForInput.data.contentEditable).toBe(false)

    const input = spanForInput.children[0]
    expect(input.sel).toBe('input')
    expect(input.data.type).toBe('checkbox')
    expect(input.data.checked).toBe(true)
    expect(typeof input.data.on.change).toBe('function')
  })
})
