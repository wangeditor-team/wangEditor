/**
 * @description paragraph plugin test
 * @author wangfupeng
 */

import { Editor, Transforms, Element, Point } from 'slate'
import { DomEditor } from '@wangeditor/core'
import { IDomEditor } from '../../../../packages/core/src/editor/interface'
import createEditor from '../../../../tests/utils/create-editor'
import withParagraph from '../../../../packages/basic-modules/src/modules/paragraph/plugin'

let editor: IDomEditor
let startLocation: Point
describe('paragraph plugin', () => {
  beforeEach(() => {
    editor = withParagraph(createEditor())
    startLocation = Editor.start(editor, [])
  })

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

  it('paragraph plugin insertDomElem api', () => {
    const startLocation = Editor.start(editor, [])
    editor.select(startLocation)
    const p = document.createElement('p')
    p.innerText = 'hello'

    editor.insertDomElem(p)

    const selectedParagraph2 = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    expect(selectedParagraph2).not.toBeNull()
  })

  it('paragraph plugin insertDomElem api with paragraph only has br', () => {
    editor.select(startLocation)
    const p = document.createElement('p')
    p.innerHTML = '<br>'

    editor.insertDomElem(p)

    const selectedParagraph2 = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    expect(selectedParagraph2).not.toBeNull()
    expect(editor.getText()).toBe('\n')
  })

  it('paragraph plugin insertDomElem api with paragraph only has children', () => {
    editor.select(startLocation)
    const p = document.createElement('p')
    p.innerHTML = '<span>hello</span>'

    editor.insertDomElem(p)

    const selectedParagraph2 = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    expect(selectedParagraph2).not.toBeNull()
    expect(editor.isEmpty()).toBeFalsy()
  })
})
