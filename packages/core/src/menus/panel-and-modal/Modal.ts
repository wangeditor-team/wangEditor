/**
 * @description modal class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IPositionStyle } from '../interface'
import PanelAndModal from './BaseClass'
import { IDomEditor } from '../../editor/interface'

class Modal extends PanelAndModal {
  readonly $elem: Dom7Array = $(`<div class="w-e-modal"></div>`)
  private width: number = 0

  constructor(editor: IDomEditor, width: number = 0) {
    super(editor)
    if (width) this.width = width
  }

  setStyle(positionStyle: Partial<IPositionStyle>) {
    const { width, $elem } = this

    $elem.attr('style', '') // 先清空 style ，再重新设置

    if (width) $elem.css('width', `${width}px`)
    $elem.css(positionStyle)
  }
}

export default Modal

// ---------------------------------- 分割线 ----------------------------------

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
