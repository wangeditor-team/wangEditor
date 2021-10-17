/**
 * @description selection API test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'

describe('editor selection API', () => {
  function getStartLocation(editor) {
    return Editor.start(editor, [])
  }

  // selection select deselect 是 slate 自带 API 或属性，不测试

  // // TODO 运行报错，看源码有使用 focus ，可能和这个相关？？？
  // it('restoreSelection', () => {
  //   const editor = createEditor()
  //   editor.select(getStartLocation(editor))

  //   editor.deselect()
  //   expect(editor.selection).toBeNull()

  //   editor.restoreSelection()
  //   expect(editor.selection).not.toBeNull()
  //   // console.log(111, JSON.stringify(editor.selection))
  // })

  it('isSelectedAll', () => {
    const p = { type: 'paragraph', children: [{ text: 'hello' }] }

    const editor = createEditor({ content: [p] })
    expect(editor.isSelectedAll()).toBeFalsy()

    editor.select(getStartLocation(editor))
    expect(editor.isSelectedAll()).toBeFalsy()

    editor.select([])
    expect(editor.isSelectedAll()).toBeTruthy()
  })
})
