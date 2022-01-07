/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

import { Editor, Node, Transforms } from 'slate'
import { DomEditor, IDomEditor } from '@wangeditor/core'
import isUrl from 'is-url'
import { isMenuDisabled, insertLink } from './helper'

function withLink<T extends IDomEditor>(editor: T): T {
  const { isInline, insertData, normalizeNode, insertDomElem, insertNode, insertText } = editor
  const newEditor = editor

  // 重写 isInline
  newEditor.isInline = elem => {
    const { type } = elem

    if (type === 'link') {
      return true
    }

    return isInline(elem)
  }

  // 重写 insertData ，粘贴插入链接
  newEditor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')
    if (!isUrl(text)) {
      // 非链接
      insertData(data)
      return
    }

    // 插入链接
    if (isMenuDisabled(newEditor)) return // disabled
    const { selection } = newEditor
    if (selection == null) return
    const selectedText = Editor.string(newEditor, selection) // 获取选中的文字
    insertLink(newEditor, selectedText, text)
  }

  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    if (type !== 'link') {
      // 未命中 link ，执行默认的 normalizeNode
      return normalizeNode([node, path])
    }

    // 如果链接内容为空，则删除
    const str = Node.string(node)
    if (str === '') {
      Transforms.removeNodes(newEditor, { at: path })
    }

    return normalizeNode([node, path])
  }

  // insert <a> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    if (domElem.tagName.toLowerCase() !== 'a') {
      insertDomElem(domElem) // 继续其他的
      return
    }

    const text = domElem.textContent
    if (!text) return null

    const href = domElem.getAttribute('href') || ''
    const target = domElem.getAttribute('target') || '_blank'

    insertText(' ')
    insertNode({
      type: 'link',
      url: href,
      target,
      children: [{ text }],
    })

    // https://github.com/wangeditor-team/wangEditor-v5/issues/332
    // 不能直接使用 insertText, 会造成添加的空格被添加到链接文本中，参考上面 issue，替换为 insertFragment 方式添加空格
    editor.insertFragment([{ text: ' ' }])
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withLink
