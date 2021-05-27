/**
 * @description dropPanel class
 * @author wangfupeng
 */

import $, { Dom7Array } from '../utils/dom'
import { gatherPanel } from './helpers'
import { IPanel } from './index'

export class DropPanel implements IPanel {
  $elem: Dom7Array = $(`<div class="w-e-drop-panel"></div>`)
  isShow: boolean = false

  constructor() {
    // 收集实例，以便可以统一 hide
    gatherPanel(this)
  }

  renderContent($content: Dom7Array) {
    const $elem = this.$elem
    $elem.html('') // 先清空，再填充内容
    $elem.append($content)
  }

  appendTo($menuItem: Dom7Array) {
    const $elem = this.$elem
    $menuItem.append($elem)
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
