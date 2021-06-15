/**
 * @description module menu helpers
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IDomEditor } from '@wangeditor/core'

/**
 * 生成 modal input elems
 * @param labelText label text
 * @param inputId input dom id
 * @param placeholder input placeholder
 * @returns [$container, $input]
 */
export function genModalInputElems(
  labelText: string,
  inputId: string,
  placeholder?: string
): Dom7Array[] {
  const $container = $('<label class="babel-container"></label>')
  $container.append(`<span>${labelText}</span>`)
  const $input = $(`<input type="text" id="${inputId}" placeholder="${placeholder || ''}">`)
  $container.append($input)

  return [$container, $input]
}

// export function genModalRadioElems(
//   labelText: string,
//   name: string,
//   options: Array<{ value: string; text: string }>
// ): Dom7Array[] {
//   const $container = $('<label class="babel-container"></label>')
//   $container.append(`<span>${labelText}</span>`)

//   return
// }

/**
 * 生成 modal button elems
 * @param buttonId button dom id
 * @param buttonText button text
 * @returns [ $container, $button ]
 */
export function genModalButtonElems(buttonId: string, buttonText: string): Dom7Array[] {
  const $buttonContainer = $('<div class="button-container"></div>')
  const $button = $(`<button id="${buttonId}">${buttonText}</button>`)
  $buttonContainer.append($button)

  return [$buttonContainer, $button]
}

/**
 * 获取 menu config
 * @param editor editor
 * @param menuKey menuKey
 */
export function getMenuConf(editor: IDomEditor, menuKey: string): { [key: string]: any } {
  const { menuConf } = editor.getConfig()
  const colorConf = menuConf[menuKey]
  return colorConf || {}
}
