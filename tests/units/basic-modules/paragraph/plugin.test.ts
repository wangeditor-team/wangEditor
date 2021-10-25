/**
 * @description paragraph plugin test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import { DomEditor } from '@wangeditor/core'
import createEditor from '../../../../tests/utils/create-editor'
import withParagraph from '../../../../packages/basic-modules/src/modules/paragraph/plugin'

describe('paragraph plugin', () => {
  const editor = withParagraph(createEditor())
  const startLocation = Editor.start(editor, [])

  it('delete to clear text', () => {
    editor.select(startLocation)
    Transforms.setNodes(editor, { type: 'header1' }) // 设置 header
    editor.deleteBackward('character') // 向后删除
    const selectedParagraph1 = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    expect(selectedParagraph1).not.toBeNull() // 执行删除后，header 变为 paragraph

    Transforms.setNodes(editor, { type: 'blockquote' }) // 设置 blockquote
    editor.deleteForward('character') // 向前删除
    const selectedParagraph2 = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    expect(selectedParagraph2).not.toBeNull() // 执行删除后，header 变为 paragraph
  })
})
