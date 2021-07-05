/**
 * @description create helper
 * @author wangfupeng
 */

import { IDomEditor } from '../editor/interface'
import $, { DOMElement } from '../utils/dom'

/**
 * 检查是否重复创建
 */
export function isRepeatedCreate(editor: IDomEditor, selector: string | DOMElement): boolean {
  const attrKey = 'data-w-e-created'

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
