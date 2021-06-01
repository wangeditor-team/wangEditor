/**
 * @description modal class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../../utils/dom'
import { gatherPanelAndModal } from '../helpers'
import { IPositionStyle, IPanel } from '../interface'

class Modal implements IPanel {
  $elem: Dom7Array = $(`<div class="w-e-modal"></div>`)
  isShow: boolean = false

  constructor() {
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
    const $elem = this.$elem

    $elem.attr('style', '') // 先清空 style ，再重新设置
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
