/**
 * @description node API test
 * @author wangfupeng
 */

import { Editor } from 'slate'
import createEditor from '../../../../tests/utils/create-editor'

describe('editor node API', () => {
  function getStartLocation(editor) {
    return Editor.start(editor, [])
  }

  it('insertNode', () => {
    const editor = createEditor()
    editor.select(getStartLocation(editor))

    const p = { type: 'paragraph', children: [{ text: 'hello' }] }
    editor.insertNode(p)

    const pList = editor.getElemsByTypePrefix('paragraph')
    expect(pList.length).toBe(2)
  })

  // insertNodes removeNodes Editor.nodes setNodes 是 slate Transforms API ，不用测试

  it('getParentNode', () => {
    const textNode = { text: 'hello' }
    const p = { type: 'paragraph', children: [textNode] }
    const editor = createEditor({
      content: [p],
    })

    const parentNode = editor.getParentNode(textNode)
    expect(parentNode).not.toBeNull()
    expect(parentNode.type).toBe('paragraph')
  })

  it('toDOMNode', done => {
    const p = { type: 'paragraph', children: [{ text: 'hello' }] }
    const editor = createEditor({
      content: [p],
    })

    setTimeout(() => {
      const domNode = editor.toDOMNode(p)
      expect(domNode.tagName).toBe('P')
      done()
    })
  })

  // isInline isVoid addMark removeMark 是 slate editor 自带 API ，不用测试

  // isText isElement marks 是 slate 提供的 API ，不用测试
})
