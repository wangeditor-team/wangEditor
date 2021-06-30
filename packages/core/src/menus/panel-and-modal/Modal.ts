/**
 * @description modal class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IPositionStyle } from '../interface'
import PanelAndModal from './BaseClass'
import { IDomEditor } from '../../editor/dom-editor'

class Modal extends PanelAndModal {
  $elem: Dom7Array = $(`<div class="w-e-modal"></div>`)
  private width: number = 0

  constructor(editor: IDomEditor, width: number = 0) {
    super(editor)
    if (width) this.width = width
  }

  setStyle(positionStyle: IPositionStyle) {
    const { width, $elem } = this

    $elem.attr('style', '') // 先清空 style ，再重新设置

    if (width) $elem.css('width', `${width}px`)
    $elem.css(positionStyle)
  }
}

export default Modal
