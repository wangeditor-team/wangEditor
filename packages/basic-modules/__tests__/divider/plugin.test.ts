/**
 * @description divider plugin test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'
import withDivider from '../../src/modules/divider/plugin'

describe('divider plugin', () => {
  let editor: any
  let startLocation: any

  beforeEach(() => {
    editor = withDivider(createEditor())
    startLocation = Editor.start(editor, [])
  })

  afterEach(() => {
    editor = null
    startLocation = null
  })

  it('divider is void node', () => {
    const elem = { type: 'divider', children: [{ text: '' }] }
    expect(editor.isVoid(elem)).toBeTruthy()
  })

  it('normalizeNode - divider 不能是最后一个元素，否则后面追加 p', () => {
    const elem = { type: 'divider', children: [{ text: '' }] }
    editor.select(startLocation)
    editor.insertNode(elem) // 插入 divider

    const length = editor.children.length
    expect(length).toBe(3) // 3 个顶级节点：p, divider, p

    const divider = editor.children[1] // 第 2 个节点应该是 divider
    expect(divider.type).toBe('divider')
    const p = editor.children[2] // 第 3 个节点应该是 p
    expect(p.type).toBe('paragraph')
  })
})
