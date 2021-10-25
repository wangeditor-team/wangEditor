/**
 * @description blockquote plugin test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import withBlockquote from '../../../../packages/basic-modules/src/modules/blockquote/plugin'

describe('blockquote plugin', () => {
  let editor: any
  let startLocation: any

  beforeEach(() => {
    editor = withBlockquote(createEditor())
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('insert break', () => {
    editor.select(startLocation)
    Transforms.setNodes(editor, { type: 'blockquote' }) // 设置 blockquote
    const pList1 = editor.getElemsByTypePrefix('paragraph')
    expect(pList1.length).toBe(0)

    editor.insertBreak() // 换行，会生成 p
    const pList2 = editor.getElemsByTypePrefix('paragraph')
    expect(pList2.length).toBe(1)
  })
})
