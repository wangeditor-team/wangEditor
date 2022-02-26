/**
 * @description todo plugin test
 * @author wangfupeng
 */

import withTodo from '../../src/modules/todo/plugin'
import createEditor from '../../../../tests/utils/create-editor'

describe('todo - plugin', () => {
  it('delete backward', () => {
    const editor = withTodo(
      createEditor({
        content: [{ type: 'todo', children: [{ text: '' }] }],
      })
    )
    editor.select({
      path: [0, 0],
      offset: 0,
    })

    const todoElems1 = editor.getElemsByType('todo')
    expect(todoElems1.length).toBe(1)

    editor.deleteBackward('character')

    const todoElems2 = editor.getElemsByType('todo')
    expect(todoElems2.length).toBe(0)
  })
})
