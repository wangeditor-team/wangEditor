/**
 * @description link menu helpers
 * @author wangfupeng
 */

import { Editor, Node, Element } from 'slate'
import { IDomEditor } from '@wangeditor/core'
import $, { Dom7Array } from '../../../utils/dom'

export function checkLink(n: Node): boolean {
  if (Editor.isEditor(n)) return false
  if (Element.isElement(n)) {
    // @ts-ignore
    return n.type === 'link'
  }
  return false
}

export function getLinkNode(editor: IDomEditor): Node | null {
  const [nodeEntry] = Editor.nodes(editor, {
    match: checkLink,
    universal: true,
  })

  if (nodeEntry == null) return null
  return nodeEntry[0]
}

/**
 * 获取 input elems
 * @param labelText label text
 * @param inputId input dom id
 * @returns [$container, $input]
 */
export function getInputElems(labelText: string, inputId: string): Dom7Array[] {
  const $container = $('<label class="babel-container"></label>')
  $container.append(`<span>${labelText}</span>`)
  const $input = $(`<input type="text" id="${inputId}">`)
  $container.append($input)

  return [$container, $input]
}

/**
 * 获取 button elems
 * @param buttonId button dom id
 * @param buttonText button text
 * @returns [ $container, $button ]
 */
export function getButtonElems(buttonId: string, buttonText: string): Dom7Array[] {
  const $buttonContainer = $('<div class="button-container"></div>')
  const $button = $(`<button id="${buttonId}">${buttonText}</button>`)
  $buttonContainer.append($button)

  return [$buttonContainer, $button]
}
