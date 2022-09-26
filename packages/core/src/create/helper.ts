/**
 * @description create helper
 * @author wangfupeng
 */

import { Descendant } from 'slate'
import { IDomEditor } from '../editor/interface'
import parseElemHtml from '../parse-html/parse-elem-html'
import $, { DOMElement } from '../utils/dom'

function isRepeatedCreate(
  editor: IDomEditor,
  attrKey: string,
  selector: string | DOMElement
): boolean {
  // @ts-ignore
  const $elem = $(selector)
  if ($elem.attr(attrKey)) {
    return true // 有属性，说明已经创建过
  }

  // 至此，说明未创建过，则记录
  $elem.attr(attrKey, 'true')

  // 销毁时删除属性
  editor.on('destroyed', () => {
    $elem.removeAttr(attrKey)
  })

  return false
}

/**
 * 检查是否重复创建 textarea
 */
export function isRepeatedCreateTextarea(
  editor: IDomEditor,
  selector: string | DOMElement
): boolean {
  return isRepeatedCreate(editor, 'data-w-e-textarea', selector)
}

/**
 * 检查是否重复创建 toolbar
 */
export function isRepeatedCreateToolbar(
  editor: IDomEditor,
  selector: string | DOMElement
): boolean {
  return isRepeatedCreate(editor, 'data-w-e-toolbar', selector)
}

/**
 * 生成默认 content
 */
export function genDefaultContent() {
  return [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]
}

/**
 * html 字符串 -> content
 * @param editor editor
 * @param html html 字符串
 */
export function htmlToContent(editor: IDomEditor, html: string = ''): Descendant[] {
  const res: Descendant[] = []

  // 空白内容
  if (html === '') html = '<p><br></p>'

  // 非 HTML 格式，文本格式，用 <p> 包裹
  if (html.indexOf('<') !== 0) {
    html = html
      .split(/\n/)
      .map(line => `<p>${line}</p>`)
      .join('')
  }

  const $content = $(`<div>${html}</div>`)
  const list = Array.from($content.children())
  list.forEach(child => {
    const $child = $(child)
    const parsedRes = parseElemHtml($child, editor)

    if (Array.isArray(parsedRes)) {
      parsedRes.forEach(el => res.push(el))
    } else {
      res.push(parsedRes)
    }
  })

  return res
}
