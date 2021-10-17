/**
 * @description create editor and toolbar test
 * @author wangfupeng
 */

import { createEditor, createToolbar } from '../../../packages/editor/src/index'

describe('create', () => {
  it('create editor and toolbar - default mode', () => {
    const editorContainer = document.createElement('div')
    document.body.appendChild(editorContainer)

    // create editor
    const editor = createEditor({
      selector: editorContainer,
    })
    expect(editor.id).not.toBeNull()

    const toolbarContainer = document.createElement('div')
    document.body.appendChild(toolbarContainer)

    // create toolbar
    const toolbar = createToolbar({
      editor,
      selector: toolbarContainer,
    })
    expect(toolbar.$box).not.toBeNull()

    // 重新创建，应该报错
    try {
      createEditor({
        selector: editorContainer,
      })
    } catch (ex) {
      expect(ex).not.toBeNull()
    }
    try {
      createToolbar({
        editor,
        selector: toolbarContainer,
      })
    } catch (ex) {
      expect(ex).not.toBeNull()
    }
  })

  it('create editor and toolbar - simple mode', () => {
    const editorContainer = document.createElement('div')
    document.body.appendChild(editorContainer)

    // create editor
    const editor = createEditor({
      selector: editorContainer,
      mode: 'simple',
    })
    expect(editor.id).not.toBeNull()

    const toolbarContainer = document.createElement('div')
    document.body.appendChild(toolbarContainer)

    // create toolbar
    const toolbar = createToolbar({
      editor,
      selector: toolbarContainer,
      mode: 'simple',
    })
    expect(toolbar.$box).not.toBeNull()
  })
})
