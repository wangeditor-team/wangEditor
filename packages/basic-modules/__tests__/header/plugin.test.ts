/**
 * @description header plugin test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import withHeader from '../../src/modules/header/plugin'

describe('header plugin', () => {
  const editor = withHeader(createEditor())
  const startLocation = Editor.start(editor, [])

  it('header break', () => {
    editor.select(startLocation)

    Transforms.setNodes(editor, { type: 'header1' })
    editor.insertBreak() // 在 header 换行，会生成 p

    const paragraphs = editor.getElemsByTypePrefix('paragraph')
    expect(paragraphs.length).toBe(1)
  })
})
