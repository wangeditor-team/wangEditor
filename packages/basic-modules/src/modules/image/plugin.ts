/**
 * @description editor 插件，重写 editor API
 * @author wangfupeng
 */

// import { Editor, Path, Operation } from 'slate'
import { IDomEditor } from '@wangeditor/core'

function withImage<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid, insertDomElem, insertNode } = editor
  const newEditor = editor

  // 重写 isInline
  newEditor.isInline = elem => {
    const { type } = elem

    if (type === 'image') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const { type } = elem

    if (type === 'image') {
      return true
    }

    return isVoid(elem)
  }

  // insert <img> DOM Element
  newEditor.insertDomElem = (domElem: Element) => {
    if (domElem.tagName.toLowerCase() !== 'img') {
      insertDomElem(domElem)
      return
    }

    const src = domElem.getAttribute('src') || ''
    const alt = domElem.getAttribute('alt') || ''
    if (!src) return

    insertNode({
      type: 'image',
      src,
      alt,
      children: [{ text: '' }],
    })
  }

  // 返回 editor ，重要！
  return newEditor
}

export default withImage
