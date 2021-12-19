/**
 * @description core editor test
 * @author luochao
 */

import { DomEditor } from '../../../../packages/core/src/editor/dom-editor'
import { IDomEditor } from '../../../../packages/core/src/editor/interface'
import createEditor from '../../../utils/create-editor'
import { Key } from '../../../../packages/core/src/utils/key'
import { NODE_TO_KEY } from '../../../../packages/core/src/utils/weak-maps'

let editor: IDomEditor

describe('Core DomEditor', () => {
  beforeEach(() => {
    editor = createEditor()
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
})
