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
    editor.insertNode(preElem) // 插入 code node
    editor.select({
      path: [1, 0, 0], // 选中 code node
      offset: 3,
    })

    editor.insertBreak() // 第一次换行，在 code-block 内部
    editor.insertBreak() // 第二次换行，在 code-block 内部
    const pList1 = editor.getElemsByTypePrefix('paragraph')
    expect(pList1.length).toBe(1)
    expect(editor.getText()).toBe('\nvar\n\n') // 两次换行

    editor.insertBreak() // 第三次换行，则生成新 p 节点
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
    expect(editor.getText()).toBe('\nvar hello')
  })

  it('normalizeNode - code node 不能是顶级元素，否则替换为 p', () => {
    editor.select(startLocation)
    editor.insertNode(codeElem)

    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(2)
  })

  it('normalizeNode - pre node 不能是第一个节点，否则前面插入 p', () => {
    editor.select(startLocation)
    Transforms.setNodes(editor, { type: 'pre' })

    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(1)

    const preList = editor.getElemsByTypePrefix('pre')
    expect(preList.length).toBe(1)
  })
})
