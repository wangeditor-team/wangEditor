/**
 * @description modal class
 * @author wangfupeng
 */

import $, { Dom7Array, DOMElement } from '../../utils/dom'
import { IPositionStyle } from '../interface'
import PanelAndModal from './BaseClass'
import { IDomEditor } from '../../editor/interface'
// import { DomEditor } from '../../editor/dom-editor'
import { SVG_CLOSE } from '../../constants/svg'
import { PANEL_OR_MODAL_TO_EDITOR } from '../../utils/weak-maps'

class Modal extends PanelAndModal {
  type = 'modal'
  readonly $elem: Dom7Array = $(`<div class="w-e-modal"></div>`)
  private width: number = 0

  constructor(editor: IDomEditor, width: number = 0) {
    super(editor)
    if (width) this.width = width

    const { $elem } = this

    // mousedown 阻止冒泡，因为在 $textContainer 通过 mousedown 隐藏 panel & modal
    $elem.on('click', e => e.stopPropagation())

    // esc 关闭 modal
    $elem.on('keyup', e => {
      const event = e as KeyboardEvent
      if (event.code === 'Escape') {
        this.hide()
        editor.restoreSelection() // 还原选区
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
    const editor = PANEL_OR_MODAL_TO_EDITOR.get(this)

    $closeButton.on('click', () => {
      this.hide()
      editor?.restoreSelection()
    })
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
): DOMElement[] {
  const $container = $('<label class="babel-container"></label>')
  $container.append(`<span>${labelText}</span>`)
  const $input = $(`<input type="text" id="${inputId}" placeholder="${placeholder || ''}">`)
  $container.append($input)

  return [$container[0], $input[0]]
}

/**
 * 生成 modal textarea elems
 * @param labelText label text
 * @param textareaId input dom id
 * @param placeholder input placeholder
 * @returns [$container, $textarea]
 */
export function genModalTextareaElems(
  labelText: string,
  textareaId: string,
  placeholder?: string
): DOMElement[] {
  const $container = $('<label class="babel-container"></label>')
  $container.append(`<span>${labelText}</span>`)
  const $textarea = $(
    `<textarea type="text" id="${textareaId}" placeholder="${placeholder || ''}"></textarea>`
  )
  $container.append($textarea)

  return [$container[0], $textarea[0]]
}

/**
 * 生成 modal button elems
 * @param buttonId button dom id
 * @param buttonText button text
 * @returns [ $container, $button ]
 */
export function genModalButtonElems(buttonId: string, buttonText: string): DOMElement[] {
  const $buttonContainer = $('<div class="button-container"></div>')
  const $button = $(`<button type="button" id="${buttonId}">${buttonText}</button>`)
  $buttonContainer.append($button)

  return [$buttonContainer[0], $button[0]]
}
