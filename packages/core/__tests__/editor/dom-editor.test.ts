/**
 * @description core editor test
 * @author luochao
 */

import { Editor, Range as SlateRange } from 'slate'
import { DomEditor } from '../../src/editor/dom-editor'
import { IDomEditor } from '../../src/editor/interface'
import createCoreEditor from '../create-core-editor' // packages/core 不依赖 packages/editor ，不能使用后者的 createEditor
import { Key } from '../../src/utils/key'
import { NODE_TO_KEY } from '../../src/utils/weak-maps'

let editor: IDomEditor

describe('Core DomEditor', () => {
  function genStartLocation() {
    return Editor.start(editor, [])
  }

  beforeEach(() => {
    editor = createCoreEditor()
    editor.select(genStartLocation())
  })

  afterEach(() => {
    editor.destroy()
  })

  test('DomEditor getWindow should throw Error', () => {
    try {
      DomEditor.getWindow(editor)
    } catch (err) {
      expect(err.message).toBe('Unable to find a host window element for this editor')
    }
  })

  test('DomEditor findKey should return Key for a node', () => {
    editor.apply({
      type: 'insert_text',
      path: [0, 0],
      text: 'test123',
      offset: 0,
    })

    const node = editor.children[0]

    expect(DomEditor.findKey(editor, node) instanceof Key).toBeTruthy()
  })

  test('DomEditor findKey should return unique Key for different node', () => {
    editor.apply({
      type: 'insert_node',
      path: [0, 0],
      node: {
        type: 'paragraph',
        children: [{ text: 'test123' }],
      },
    })

    editor.apply({
      type: 'insert_node',
      path: [0, 1],
      node: {
        type: 'header1',
        children: [{ text: 'test456' }],
      },
    })

    const [node1, node2] = (editor.children[0] as any).children
    const keyId1 = DomEditor.findKey(editor, node1).id
    const keyId2 = DomEditor.findKey(editor, node2).id

    expect(keyId1).not.toBe(keyId2)
  })

  test('DomEditor findKey should generate new key if node do not exist in NODE_TO_KEY', () => {
    const node = {
      type: 'header2',
      children: [{ text: '123' }],
    }

    // 防卫断言
    expect(NODE_TO_KEY.get(node)).toBeUndefined()

    const newKey = DomEditor.findKey(editor, node)
    expect(NODE_TO_KEY.get(node)).toEqual(newKey)
  })

  test('DomEditor setNewKey should set new value to NODE_TO_KEY', () => {
    const node = {
      type: 'header2',
      children: [{ text: '123' }],
    }

    expect(NODE_TO_KEY.get(node)).toBeUndefined()

    DomEditor.setNewKey(node)

    expect(NODE_TO_KEY.get(node)).not.toBeUndefined()
  })

  test('findPath', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    const path = DomEditor.findPath(null, textNode)
    expect(path).toEqual([0, 0])
  })

  test('findDocumentOrShadowRoot', () => {
    const doc = DomEditor.findDocumentOrShadowRoot(editor)
    expect(doc).toBe(document)
  })

  test('getParentNode', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    expect(DomEditor.getParentNode(null, textNode)).toBe(p)
    expect(DomEditor.getParentNode(null, p)).toBe(editor)
  })

  test('getParentsNodes', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    const parents = DomEditor.getParentsNodes(editor, textNode)
    expect(parents[0]).toBe(p)
    expect(parents[1]).toBe(editor)
  })

  test('getTopNode', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    const topNode = DomEditor.getTopNode(editor, textNode)
    expect(topNode).toBe(p)
  })

  test('toDOMNode', () => {
    const p = editor.children[0]

    const key = DomEditor.findKey(editor, p)

    const domNode = DomEditor.toDOMNode(editor, p)
    expect(domNode.tagName).toBe('DIV')
    expect(domNode.id).toBe(`w-e-element-${key.id}`)
  })

  test('hasDOMNode', () => {
    const p = editor.children[0]
    const domNode = DomEditor.toDOMNode(editor, p)

    const res = DomEditor.hasDOMNode(editor, domNode)
    expect(res).toBeTruthy()
  })

  // TODO 待写...
  // test('toDOMRange', () => {})

  // TODO 待写...
  // test('toDOMPoint', () => {})

  test('toSlateNode', () => {
    const p = editor.children[0]
    const domNode = DomEditor.toDOMNode(editor, p)

    const slateNode = DomEditor.toSlateNode(null, domNode)
    expect(slateNode).toBe(p)
  })

  // TODO 待写...
  // test('findEventRange', () => {})

  // TODO 待写...
  // test('toSlateRange', () => {})

  // TODO 待写...
  // test('toSlatePoint', () => {})

  test('hasRange', () => {
    editor.insertText('hello')
    editor.selectAll()

    const res = DomEditor.hasRange(editor, editor.selection as SlateRange)
    expect(res).toBeTruthy()

    // expect(1).toBe(1)
  })

  test('getNodeType', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    expect(DomEditor.getNodeType(p)).toBe('paragraph')
    expect(DomEditor.getNodeType(textNode)).toBe('')
  })

  test('checkNodeType', () => {
    const p = editor.children[0]
    expect(DomEditor.checkNodeType(p, 'paragraph')).toBeTruthy()
  })

  test('getSelectedElems', () => {
    editor.insertNode({
      type: 'some-elem',
      children: [{ text: 'hello' }],
    })
    editor.selectAll()

    const selectedElems = DomEditor.getSelectedElems(editor)

    expect(selectedElems.length).toBe(2)
    expect(selectedElems[1].type).toBe('some-elem')
  })

  test('getSelectedNodeByType', () => {
    const p = editor.children[0]
    const selectedNode = DomEditor.getSelectedNodeByType(editor, 'paragraph')
    expect(selectedNode).toBe(p)
  })

  test('getSelectedTextNode', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    const selectedTextNode = DomEditor.getSelectedTextNode(editor)
    expect(selectedTextNode).toBe(textNode)
  })

  test('isNodeSelected', () => {
    const p = editor.children[0]
    // @ts-ignore
    const textNode = p.children[0]

    expect(DomEditor.isNodeSelected(editor, p)).toBeTruthy()
    expect(DomEditor.isNodeSelected(editor, textNode)).toBeTruthy()
  })

  test('isSelectionAtLineEnd', () => {
    editor.insertText('hello')
    expect(DomEditor.isSelectionAtLineEnd(editor, [0])).toBeTruthy() // 在第一行的末尾

    editor.select(genStartLocation()) // 选中开始
    expect(DomEditor.isSelectionAtLineEnd(editor, [0])).toBeFalsy() // 在第一行的开头
  })
})
