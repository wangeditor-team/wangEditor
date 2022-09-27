/**
 * @description to html
 * @author wangfupeng
 */

import { Element, Path, Editor } from 'slate'
import { DomEditor } from '@wangeditor/core'
import { ListItemElement } from './custom-types'
import { ELEM_TO_EDITOR } from '../utils/maps'

/**
 * 当前 list-item 前面需要拼接几个 <ol> 或 <ul>
 * @param elem elem
 */
function getStartContainerTagNumber(elem: Element): number {
  const editor = ELEM_TO_EDITOR.get(elem)
  if (editor == null) return 0

  const { type, ordered = false, level = 0 } = elem as ListItemElement

  const path = DomEditor.findPath(editor, elem)
  if (path[0] === 0) {
    // list-item 是第一个元素，再往前没有了。需要拼接 <ol> 或 <ul>
    return level + 1
  }

  // 获取上一个 elem
  const prevPath = Path.previous(path)
  const prevEntry = Editor.node(editor, prevPath)
  if (!prevEntry) return 0
  const [prevElem] = prevEntry

  const prevType = DomEditor.getNodeType(prevElem)
  if (prevType !== type) {
    // 上一个 elem 不是 list-item ，需要拼接 <ol> 或 <ul>
    return level + 1
  }

  // 上一个 elem 是 list-item
  const { ordered: prevOrdered = false, level: prevLevel = 0 } = prevElem as ListItemElement
  if (prevLevel < level) {
    // 上一个 level 小于当前 level ，需要拼接 <ol> 或 <ul>
    return level - prevLevel
  }
  if (prevLevel > level) {
    // 上一个 level 大于当前 level ，不需要拼接 <ol> 或 <ul>
    return 0
  }
  if (prevLevel === level) {
    // 上一个 level 等于当前 level
    if (prevOrdered === ordered) {
      // ordered 一致，则不需要拼接 <ol> 或 <ul>
      return 0
    } else {
      /// ordered 不一致，则需要拼接 <ol> 或 <ul>
      return 1
    }
  }

  // 其他情况
  return 0
}

/**
 * 当前 list-item 后面面需要拼接几个 </ol> 或 </ul>
 * @param elem elem
 */
function getEndContainerTagNumber(elem: Element): number {
  const editor = ELEM_TO_EDITOR.get(elem)
  if (editor == null) return 0

  const { type, ordered = false, level = 0 } = elem as ListItemElement

  const path = DomEditor.findPath(editor, elem)
  if (path[0] === editor.children.length - 1) {
    // list-item 是最后一个元素，再往后没有了。需要拼接 </ol> 或 </ul>
    return level + 1
  }

  // 获取下一个 elem
  const nextPath = Path.next(path)
  const nextEntry = Editor.node(editor, nextPath)
  if (!nextEntry) return 0
  const [nextElem] = nextEntry

  const nextType = DomEditor.getNodeType(nextElem)
  if (nextType !== type) {
    // 下一个 elem 不是 list-item ，需要拼接 <ol> 或 <ul>
    return level + 1
  }

  // 下一个 elem 是 list-item
  const { ordered: nextOrdered = false, level: nextLevel = 0 } = nextElem as ListItemElement
  if (nextLevel < level) {
    // 下一个 level 小于当前 level ，需要拼接 </ol> 或 </ul>
    return level - nextLevel
  }
  if (nextLevel > level) {
    // 下一个 level 大于当前 level ，不需要拼接 </ol> 或 </ul>
    return 0
  }
  if (nextLevel === level) {
    // 下一个 level 等于当前 level
    if (nextOrdered === ordered) {
      // ordered 一致，则不需要拼接 </ol> 或 </ul>
      return 0
    } else {
      /// ordered 不一致，则需要拼接 </ol> 或 </ul>
      return 1
    }
  }

  // 其他情况
  return 0
}

// ol ul 栈
const CONTAINER_TAG_STACK: Array<string> = []

function elemToHtml(
  elem: Element,
  childrenHtml: string
): {
  html: string
  prefix?: string
  suffix?: string
} {
  let startContainerStr = ''
  let endContainerStr = ''

  const { ordered = false } = elem as ListItemElement
  const containerTag = ordered ? 'ol' : 'ul'

  // 前面需要拼接几个 <ol> 或 <ul>
  const startContainerTagNumber = getStartContainerTagNumber(elem)
  if (startContainerTagNumber > 0) {
    for (let i = 0; i < startContainerTagNumber; i++) {
      startContainerStr += `<${containerTag}>` // 记录 start container tag ，如 `<ul>`
      CONTAINER_TAG_STACK.push(containerTag) // tag 压栈
    }
  }

  // 后面需要拼接几个 </ol> 或 </ul>
  const endContainerTagNumber = getEndContainerTagNumber(elem)
  if (endContainerTagNumber > 0) {
    for (let i = 0; i < endContainerTagNumber; i++) {
      const tag = CONTAINER_TAG_STACK.pop() // tag 从栈中获取
      endContainerStr += `</${tag}>` // 记录 end container tag ，如 `</ul>`
    }
  }

  return {
    html: `<li>${childrenHtml}</li>`,
    prefix: startContainerStr,
    suffix: endContainerStr,
  }
}

const listItemToHtmlConf = {
  type: 'list-item',
  elemToHtml: elemToHtml,
}

export default listItemToHtmlConf
