/**
 * @description panel modal baseClass
 * @author wangfupeng
 */

import { IDomEditor } from '../../editor/interface'
import { Dom7Array } from '../../utils/dom'
import { EDITOR_TO_PANEL_AND_MODAL } from '../../utils/weak-maps'

abstract class PanelAndModal {
  abstract $elem: Dom7Array
  isShow: boolean = false
  private showTime: number = 0 // 显示时的时间戳

  constructor(editor: IDomEditor) {
    this.record(editor)
  }

  /**
   * 记录下来，以便隐藏，API editor.hidePanelOrModal
   */
  private record(editor: IDomEditor) {
    let set = EDITOR_TO_PANEL_AND_MODAL.get(editor)
    if (set == null) {
      set = new Set()
      EDITOR_TO_PANEL_AND_MODAL.set(editor, set)
    }
    set.add(this)
  }

  renderContent($content: Dom7Array) {
    const $elem = this.$elem
    $elem.html('') // 先清空，再填充内容
    $elem.append($content)
  }

  appendTo($menuElem: Dom7Array) {
    const $elem = this.$elem
    $menuElem.append($elem)
  }

  show() {
    if (this.isShow) return
    this.showTime = Date.now()

    const $elem = this.$elem
    $elem.show()
    this.isShow = true
  }

  hide() {
    if (!this.isShow) return

    const now = Date.now()
    if (now - this.showTime < 200) {
      // 刚显示的，不要立刻隐藏（避免频繁触发 show/hide ）
      return
    }

    const $elem = this.$elem
    $elem.hide()
    this.isShow = false
  }
}

export default PanelAndModal
