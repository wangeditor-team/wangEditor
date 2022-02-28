/**
 * @description create editor and toolbar test
 * @author wangfupeng
 */

import { createEditor, createToolbar } from '../../../packages/editor/src/index'
import { ICreateEditorOption, ICreateToolbarOption } from '../../../packages/editor/src/create'

function customCreateEditor(config: Partial<ICreateEditorOption> = {}) {
  const editorContainer = document.createElement('div')
  document.body.appendChild(editorContainer)

  // create editor
  const editor = createEditor({
    selector: editorContainer,
    ...config,
  })

  return editor
}

function customCreateToolbar(config: Partial<ICreateToolbarOption> = {}) {
  const toolbarContainer = document.createElement('div')
  document.body.appendChild(toolbarContainer)

  // create editor
  const editor = customCreateEditor()

  // create toolbar
  const toolbar = createToolbar({
    editor,
    selector: toolbarContainer,
    ...config,
  })

  return toolbar
}

describe('create editor and toolbar', () => {
  test('create editor with default mode', () => {
    const editor = customCreateEditor()

    expect(editor.id).not.toBeNull()
  })

  test('create editor with default mode that has text hoverbar', () => {
    const editor = customCreateEditor()
    const config = editor.getConfig()

    expect(config.hoverbarKeys!.text).not.toBeNull()
  })

  test('create editor with simple mode', () => {
    const editor = customCreateEditor({
      mode: 'simple',
    })
    expect(editor.id).not.toBeNull()
  })

  test('create editor with simple mode that does not has text hoverbar', () => {
    const editor = customCreateEditor({
      mode: 'simple',
    })
    const config = editor.getConfig()

    expect(config.hoverbarKeys!.text).toBeUndefined()
  })

  test('create editor can not be called twice with same container', () => {
    const editorContainer = document.createElement('div')
    document.body.appendChild(editorContainer)
    // create editor
    customCreateEditor({
      selector: editorContainer,
    })

    try {
      customCreateEditor({
        selector: editorContainer,
      })
    } catch (ex) {
      expect(ex.message.indexOf('Repeated create editor by selector')).not.toBe(-1)
    }
  })

  test('create toolbar with default mode', () => {
    const toolbar = customCreateToolbar()
    expect(toolbar.$box).not.toBeNull()
  })

  test('create toolbar with simple mode', () => {
    const toolbar = customCreateToolbar({
      mode: 'simple',
    })
    expect(toolbar.$box).not.toBeNull()
  })

  test('create toolbar with simple mode that the config hoverbarKeys is different from default mode', () => {
    const simpleToolbar = customCreateToolbar({
      mode: 'simple',
    })
    const defaultToolbar = customCreateToolbar()
    expect(simpleToolbar.getConfig().toolbarKeys).not.toEqual(
      defaultToolbar.getConfig().toolbarKeys
    )
  })

  test('create toolbar can not be called twice with same container', () => {
    const toolbarContainer = document.createElement('div')
    document.body.appendChild(toolbarContainer)

    customCreateToolbar({
      selector: toolbarContainer,
    })
    try {
      customCreateToolbar({
        selector: toolbarContainer,
      })
    } catch (ex) {
      expect(ex.message.indexOf('Repeated create toolbar by selector')).not.toBe(-1)
    }
  })

  test('create editor with html', () => {
    const html = `<h1>header</h1>
<p>hello&nbsp;<strong>world</strong>
</p><p><br></p>`

    const editor = customCreateEditor({ html })
    expect(editor.children).toEqual([
      { type: 'header1', children: [{ text: 'header' }] },
      {
        type: 'paragraph',
        children: [{ text: 'hello ' }, { text: 'world', bold: true }],
      },
      { type: 'paragraph', children: [{ text: '' }] },
    ])
  })
})
