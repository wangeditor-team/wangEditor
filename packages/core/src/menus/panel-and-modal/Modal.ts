/**
 * @description modal class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { IPanel, gatherPanelAndModal } from '../panel-and-modal/index'
import { IPositionStyle } from '../interface'

class Modal implements IPanel {
  $elem: Dom7Array = $(`<div class="w-e-modal"></div>`)
  isShow: boolean = false
  private width: number = 0

  constructor(width: number = 0) {
    if (width) this.width = width

    // 收集实例，以便可以统一 hide
    gatherPanelAndModal(this)
  }

  renderContent($content: Dom7Array) {
    const $elem = this.$elem
    $elem.html('') // 先清空，再填充内容
    $elem.append($content)
  }

  appendTo($container: Dom7Array) {
    const $elem = this.$elem
    $elem.on('click', (e: Event) => e.stopPropagation())
    $container.append($elem)
  }

  setStyle(positionStyle: IPositionStyle) {
    const { width, $elem } = this

    $elem.attr('style', '') // 先清空 style ，再重新设置

    if (width) $elem.css('width', `${width}px`)
    $elem.css(positionStyle)
  }

  show() {
    if (this.isShow) return

    const $elem = this.$elem

    $elem.show()
    this.isShow = true
  }

  hide() {
    if (!this.isShow) return

    const $elem = this.$elem
    $elem.hide()
    this.isShow = false
  }
}

export default Modal
