/**
 * @description slate 插件 - content
 * @author wangfupeng
 */

import xmlFormat from 'xml-formatter'
import { Editor, Node, Text } from 'slate'
import { DomEditor } from '../dom-editor'
import { IDomEditor } from '../..'
import { EDITOR_TO_SELECTION } from '../../utils/weak-maps'
import { node2html } from '../../to-html/node2html'
import { genElemId } from '../../formats/helper'

export const withContent = <T extends Editor>(editor: T) => {
  const e = editor as T & IDomEditor
  const { onChange, insertText } = e

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
    // maxLength
    const { maxLength, onMaxLength } = e.getConfig()
    if (typeof maxLength === 'number' && maxLength > 0) {
      const editorText = e.getText()
      if (editorText.length >= maxLength) {
        // 触发 maxLength 限制，不再继续插入文字
        if (onMaxLength) onMaxLength(e)
        return
      }
    }

    // 执行默认的 insertText
    insertText(s)
  }

  // tab
  e.handleTab = () => {
    e.insertText('    ')
  }

  // 获取 html
  e.getHtml = (): string => {
    const { children = [] } = e
    const html = children.map(child => node2html(child, e)).join('\n')
    return xmlFormat(`<div>${html}</div>`, {
      collapseContent: true,
    })
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

  return e
}
