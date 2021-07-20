/**
 * @description slate 插件 - content
 * @author wangfupeng
 */

import xmlFormat from 'xml-formatter'
import { Editor, Node, Text, Path, Operation, Range, Transforms } from 'slate'
import { DomEditor } from '../dom-editor'
import { IDomEditor } from '../..'
import { EDITOR_TO_SELECTION, NODE_TO_KEY } from '../../utils/weak-maps'
import { node2html } from '../../to-html/node2html'
import { genElemId } from '../../formats/helper'
import { Key } from '../../utils/key'
import { findCurrentLineRange } from '../../utils/line'
import $ from '../../utils/dom'

export const withContent = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor
  const { onChange, insertText, apply, deleteBackward } = e

  // 重写 apply 方法
  // apply 方法非常重要，它最终执行 operation https://docs.slatejs.org/concepts/05-operations
  // operation 的接口定义参考 slate src/interfaces/operation.ts
  e.apply = (op: Operation) => {
    const matches: [Path, Key][] = []

    switch (op.type) {
      case 'insert_text':
      case 'remove_text':
      case 'set_node': {
        for (const [node, path] of Editor.levels(e, { at: op.path })) {
          // 在当前节点寻找
          const key = DomEditor.findKey(e, node)
          matches.push([path, key])
        }
        break
      }

      case 'insert_node':
      case 'remove_node':
      case 'merge_node':
      case 'split_node': {
        for (const [node, path] of Editor.levels(e, { at: Path.parent(op.path) })) {
          // 在父节点寻找
          const key = DomEditor.findKey(e, node)
          matches.push([path, key])
        }
        break
      }

      case 'move_node': {
        for (const [node, path] of Editor.levels(e, {
          at: Path.common(Path.parent(op.path), Path.parent(op.newPath)),
        })) {
          const key = DomEditor.findKey(e, node)
          matches.push([path, key])
        }
        break
      }
    }

    // 执行原本的 apply - 重要！！！
    apply(op)

    // 绑定 node 和 key
    for (const [path, key] of matches) {
      const [node] = Editor.node(e, path)
      NODE_TO_KEY.set(node, key)
    }
  }

  e.deleteBackward = unit => {
    if (unit !== 'line') {
      return deleteBackward(unit)
    }

    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const parentBlockEntry = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
        at: editor.selection,
      })

      if (parentBlockEntry) {
        const [, parentBlockPath] = parentBlockEntry
        const parentElementRange = Editor.range(editor, parentBlockPath, editor.selection.anchor)

        const currentLineRange = findCurrentLineRange(e, parentElementRange)

        if (!Range.isCollapsed(currentLineRange)) {
          Transforms.delete(editor, { at: currentLineRange })
        }
      }
    }
  }

  // 重写 onchange API
  e.onChange = () => {
    // 记录当前选区
    const { selection } = e
    if (selection != null) {
      EDITOR_TO_SELECTION.set(e, selection)
    }

    // 触发配置的 change 事件
    e.emit('change')

    onChange()
  }

  e.insertText = (s: string) => {
    // 若触发 maxLength ，则不继续插入
    //【注意】拼音的 maxLength 限制，不在这里，在 compositionStart 和 compositionEnd 里处理
    const res = DomEditor.checkMaxLength(e)
    if (res) {
      return
    }

    // 执行默认的 insertText
    insertText(s)
  }

  // tab
  e.handleTab = () => {
    e.insertText('    ')
  }

  // 获取 html
  e.getHtml = (withFormat = true): string => {
    const { children = [] } = e
    let html = children.map(child => node2html(child, e)).join('')
    html = `<div>${html}</div>`

    if (withFormat) {
      return xmlFormat(html, {
        collapseContent: true,
      })
    }
    return html
  }

  // 获取 text
  e.getText = (): string => {
    const { children = [] } = e
    return children.map(child => Node.string(child)).join('\n')
  }

  // 获取选区文字
  e.getSelectionText = (): string => {
    const { selection } = e
    if (selection == null) return ''
    return Editor.string(editor, selection)
  }

  // 获取所有标题
  e.getHeaders = () => {
    const headers: { id: string; type: string; text: string }[] = []
    const { children = [] } = e
    children.forEach(n => {
      if (Text.isText(n)) return

      const { type = '' } = n
      if (type.startsWith('header')) {
        const key = DomEditor.findKey(e, n)
        const id = genElemId(key.id)
        const text = Node.string(n)

        headers.push({ id, type, text })
      }
    })
    return headers
  }

  e.getParentNode = (node: Node) => {
    return DomEditor.getParentNode(e, node)
  }

  return e
}
