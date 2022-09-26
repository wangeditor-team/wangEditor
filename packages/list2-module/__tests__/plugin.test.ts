/**
 * @description list plugin test
 * @author wangfupeng
 */

import withList from '../src/module/plugin'
import createEditor from '../../../tests/utils/create-editor'

describe('list plugin test', () => {
  it('insert tab - increase level', () => {
    const listItem = { type: 'list2-item', children: [{ text: 'hello' }] }
    let editor = createEditor({
      content: [listItem],
    })
    editor = withList(editor) // 使用插件
    editor.select({ path: [0, 0], offset: 0 }) // 选中 list-item 开头

    editor.handleTab() // tab

    const children = editor.children
    expect(children).toEqual([
      {
        ...listItem,
        level: 1, // 增加 level
      },
    ])
  })

  it('insert delete - decrease level', () => {
    const listItem = { type: 'list2-item', children: [{ text: 'hello' }], level: 2 }
    let editor = createEditor({
      content: [listItem],
    })
    editor = withList(editor) // 使用插件
    editor.select({ path: [0, 0], offset: 0 }) // 选中 list-item 开头

    editor.deleteBackward('character') // delete
    expect(editor.children).toEqual([
      {
        ...listItem,
        level: 1, // 减少 level
      },
    ])

    editor.deleteBackward('character') // delete
    expect(editor.children).toEqual([
      {
        ...listItem,
        level: 0, // 减少 level
      },
    ])
  })
})
