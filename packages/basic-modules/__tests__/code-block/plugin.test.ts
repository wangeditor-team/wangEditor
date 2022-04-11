/**
 * @description code-block plugin test
 * @author wangfupeng
 */

import { Editor, Transforms } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import withCodeBlock from '../../src/modules/code-block/plugin'

// 模拟 DataTransfer
class MyDataTransfer {
  private values: object = {}
  setData(type: string, value: string) {
    this.values[type] = value
  }
  getData(type: string): string {
    return this.values[type]
  }
}

describe('code-block plugin', () => {
  let editor: any
  let startLocation: any

  const codeElem = {
    type: 'code',
    children: [{ text: 'var' }],
  }
  const preElem = {
    type: 'pre',
    children: [codeElem],
  }

  beforeEach(() => {
    editor = withCodeBlock(createEditor())
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('insert break', () => {
    editor.select(startLocation)
    editor.insertNode(preElem) // 插入 code-block

    // code-block 前后会自动生成两个 p
    const pList1 = editor.getElemsByTypePrefix('paragraph')
    expect(pList1.length).toBe(2)

    editor.select({
      path: [1, 0, 0], // 选中 code-block
      offset: 3,
    })

    // 换行都在 code-block 内部
    editor.insertBreak()
    editor.insertBreak()
    editor.insertBreak()
    expect(editor.getText()).toBe('\nvar\n\n\n\n')

    // 不会再生成新的 p
    const pList2 = editor.getElemsByTypePrefix('paragraph')
    expect(pList2.length).toBe(2)
  })

  it('insert data', () => {
    editor.select(startLocation)
    editor.insertNode(preElem) // 插入 code node
    editor.select({
      path: [1, 0, 0], // 选中 code node
      offset: 3,
    })

    const data = new MyDataTransfer()
    data.setData('text/plain', ' hello')

    editor.insertData(data)
    expect(editor.getText()).toBe('\nvar hello\n')
  })

  it('normalizeNode - code node 不能是顶级元素，否则替换为 p', () => {
    editor.select(startLocation)
    editor.insertNode(codeElem)

    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(2)
  })

  it('normalizeNode - pre node 不能是第一个节点，否则前面插入 p', () => {
    editor.select(startLocation)
    editor.insertNode({ type: 'pre', children: [{ type: 'code', children: [{ text: 'var' }] }] })

    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(2)

    const preList = editor.getElemsByTypePrefix('pre')
    expect(preList.length).toBe(1)
  })
})
