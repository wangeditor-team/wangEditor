/**
 * @description todo-menu test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../../tests/utils/create-editor'
import TodoMenu from '../../../src/modules/todo/menu/Todo'

describe('todo-menu', () => {
  let editor: any
  let startLocation: any
  const menu = new TodoMenu()

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('get value', () => {
    expect(menu.getValue(editor)).toBe('')
  })

  it('is active', () => {
    editor.select(startLocation)
    expect(menu.isActive(editor)).toBeFalsy()

    // @ts-ignore
    Transforms.setNodes(editor, { type: 'todo' })
    expect(menu.isActive(editor)).toBeTruthy()
  })

  it('is disable - paragraph and todo', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    // @ts-ignore
    Transforms.setNodes(editor, { type: 'todo' })
    expect(menu.isDisabled(editor)).toBeFalsy()
  })

  it('is disable - list', () => {
    editor.select(startLocation)
    editor.insertNode({
      type: 'bulleted-list',
      children: [
        {
          type: 'list-item',
          children: [{ text: 'hello' }],
        },
      ],
    })
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  it('is disable - table', () => {
    editor.select(startLocation)
    editor.insertNode({
      type: 'table',
      children: [
        {
          type: 'table-row',
          children: [
            {
              type: 'table-cell',
              children: [{ text: 'hello' }],
            },
          ],
        },
      ],
    })
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  it('is disable - pre/code', () => {
    editor.select(startLocation)
    editor.insertNode({
      type: 'pre',
      children: [
        {
          type: 'code',
          children: [{ text: 'hello' }],
        },
      ],
    })
    expect(menu.isDisabled(editor)).toBeTruthy()
  })

  it('exec - paragraph to todo', () => {
    editor.select(startLocation)
    menu.exec(editor, '')

    const todoElems = editor.getElemsByType('todo')
    expect(todoElems.length).toBe(1)
  })

  it('exec - todo to paragraph', () => {
    editor.select(startLocation)
    // @ts-ignore
    Transforms.setNodes(editor, { type: 'todo' })
    menu.exec(editor, '')

    const todoElems = editor.getElemsByType('todo')
    expect(todoElems.length).toBe(0)
  })
})
