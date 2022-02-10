/**
 * @description parse html
 * @author wangfupeng
 */

import { Descendant, Text } from 'slate'
import { Dom7Array } from 'dom7'
import { IDomEditor } from '@wangeditor/core'
import { TodoElement } from './custom-types'

function parseHtml($elem: Dom7Array, children: Descendant[], editor: IDomEditor): TodoElement {
  children = children.filter(child => {
    if (Text.isText(child)) return true
    if (editor.isInline(child)) return true
    return false
  })

  // 无 children ，则用纯文本
  if (children.length === 0) {
    children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
  }

  // 获取 checked
  let checked = false
  const $input = $elem.find('input[type="checkbox"]')
  if ($input.attr('checked') != null) {
    checked = true
  }

  return {
    type: 'todo',
    checked,
    // @ts-ignore
    children,
  }
}

export const parseHtmlConf = {
  selector: 'div[data-w-e-type="todo"]',
  parseElemHtml: parseHtml,
}
