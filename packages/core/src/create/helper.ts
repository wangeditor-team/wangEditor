/**
 * @description create helper
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/interface'
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
