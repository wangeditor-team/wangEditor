/**
 * @description modal class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IPositionStyle } from '../interface'
import PanelAndModal from './BaseClass'
import { IDomEditor } from '../../editor/interface'
import { DomEditor } from '../../editor/dom-editor'
import { SVG_CLOSE } from '../../constants/svg'

class Modal extends PanelAndModal {
  readonly $elem: Dom7Array = $(`<div class="w-e-modal"></div>`)
  private width: number = 0

  constructor(editor: IDomEditor, width: number = 0) {
    super(editor)
    if (width) this.width = width

    const { $elem } = this

    // mousedown 阻止冒泡，因为在 $textContainer 通过 mousedown 隐藏 panel & modal
    $elem.on('mousedown', e => e.stopPropagation())

    // esc 关闭 modal
    $elem.on('keyup', e => {
      const event = e as KeyboardEvent
      if (event.code === 'Escape') {
        this.hide()
        DomEditor.restoreSelection(editor) // 还原选区
      }
    })
  }

  /**
   * 生成要添加到 modal $elem 的元素
   * 【注意】不要直接 append 到 modal $elem ，因为它每次都会清空 html('')
   */
  genSelfElem(): Dom7Array | null {
    // 关闭按钮
    const $closeButton = $(`<span class="btn-close">${SVG_CLOSE}</span>`)
    $closeButton.on('click', () => this.hide())
    return $closeButton
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
