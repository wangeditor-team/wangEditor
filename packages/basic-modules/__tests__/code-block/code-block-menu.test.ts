/**
 * @description code-block menu test
 * @author wangfupeng
 */

import { Editor, Transforms, Element } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import CodeBlockMenu from '../../src/modules/code-block/menu/CodeBlockMenu'

describe('code-block menu', () => {
  const menu = new CodeBlockMenu()
  let editor: any
  let startLocation: any

  const codeElem = {
    type: 'code',
    language: 'javascript',
    children: [{ text: 'var' }],
  }
  const preElem = {
    type: 'pre',
    children: [codeElem],
  }

  beforeEach(() => {
    editor = createEditor()
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('getValue and isActive', done => {
    editor.select(startLocation)
    expect(menu.isActive(editor)).toBeFalsy()
    expect(menu.getValue(editor)).toBe('')

    editor.insertNode(preElem) // 插入 code node
    editor.select({
      path: [1, 0, 0], // 选中 code node
      offset: 3,
    })
    setTimeout(() => {
      expect(menu.isActive(editor)).toBeTruthy()
      expect(menu.getValue(editor)).toBe('javascript')
      done()
    })
  })

  it('is disabled', () => {
    editor.select(startLocation)
    expect(menu.isDisabled(editor)).toBeFalsy()

    Transforms.setNodes(editor, { type: 'header1' } as Partial<Element>)
    expect(menu.isDisabled(editor)).toBeTruthy() // 非 p pre ，则禁用

    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })
    expect(menu.isDisabled(editor)).toBeFalsy()
    // Transforms.removeNodes(editor, { mode: 'highest' }) // 移除 pre/code
  })

  it('exec - to code-block', () => {
    editor.select(startLocation)

    menu.exec(editor, 'javascript') // 生成 code-block
    const preList = editor.getElemsByTypePrefix('pre')
    expect(preList.length).toBe(1)
    const codeLis = editor.getElemsByTypePrefix('code')
    expect(codeLis.length).toBe(1)
  })

  it('exec - to paragraph', () => {
    editor.select(startLocation)
    editor.insertNode(preElem) // 插入 code node
    editor.select({
      path: [1, 0, 0], // 选中 code node
      offset: 3,
    })

    menu.exec(editor, '') // 取消 code-block
    const preList = editor.getElemsByTypePrefix('pre')
    expect(preList.length).toBe(0)
    const codeLis = editor.getElemsByTypePrefix('code')
    expect(codeLis.length).toBe(0)
  })
})
