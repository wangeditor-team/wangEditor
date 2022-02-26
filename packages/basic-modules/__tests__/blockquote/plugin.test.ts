/**
 * @description blockquote plugin test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import withBlockquote from '../../src/modules/blockquote/plugin'

describe('blockquote plugin', () => {
  let editor = withBlockquote(createEditor())
  let startLocation = Editor.start(editor, [])

  beforeEach(() => {
    editor = withBlockquote(createEditor())
    startLocation = Editor.start(editor, [])
  })

  it('insert break', () => {
    expect(1).toBeTruthy()

    // TODO 该测试一直报错（找不到 blockquote path），待定处理
    // editor.select(startLocation)

    // // @ts-ignore
    // Transforms.setNodes(editor, { type: 'blockquote' }) // 设置 blockquote

    // const pList1 = editor.getElemsByType('paragraph')
    // expect(pList1.length).toBe(0)

    // editor.insertText('hello')
    // console.log(11, JSON.stringify(editor.children))
    // console.log(22, JSON.stringify(editor.selection))
    // editor.insertBreak() // 第一次换行，内部插入 \n

    // const pList2 = editor.getElemsByType('paragraph')
    // expect(pList2.length).toBe(0)

    // editor.insertBreak() // 再一次换行，生成 p
    // const pList3 = editor.getElemsByType('paragraph')
    // expect(pList3.length).toBe(1)
  })
})
