/**
 * @description panel modal baseClass
 * @author wangfupeng
 */

import { IDomEditor } from '../../editor/interface'
import { Dom7Array, DOMElement } from '../../utils/dom'
import { EDITOR_TO_PANEL_AND_MODAL, PANEL_OR_MODAL_TO_EDITOR } from '../../utils/weak-maps'

abstract class PanelAndModal {
  abstract readonly type: string
  abstract readonly $elem: Dom7Array
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

    PANEL_OR_MODAL_TO_EDITOR.set(this, editor)
  }

  /**
   * 除了 content 之外的其他自己要增加的 elem
   */
  abstract genSelfElem(): Dom7Array | null

  renderContent(contentElem: DOMElement) {
    const { $elem } = this
    $elem.empty() // 先清空，再填充内容
    $elem.append(contentElem)

    // 添加自己额外的 elem
    const $selfElem = this.genSelfElem()
    if ($selfElem) {
      $elem.append($selfElem)
    }
  }

  appendTo($menuElem: Dom7Array) {
    const { $elem } = this
    $menuElem.append($elem)
  }

  show() {
    if (this.isShow) return
    this.showTime = Date.now()

    const { $elem } = this
    $elem.show()
    this.isShow = true

    // 触发事件
    const editor = PANEL_OR_MODAL_TO_EDITOR.get(this)
    if (editor) editor.emit('modalOrPanelShow', this)
  }

  hide() {
    if (!this.isShow) return

    const now = Date.now()
    if (now - this.showTime < 200) {
      // 刚显示的，不要立刻隐藏（避免频繁触发 show/hide ）
      return
    }

    const { $elem } = this
    $elem.hide()
    this.isShow = false

    // 触发事件
    const editor = PANEL_OR_MODAL_TO_EDITOR.get(this)
    if (editor) editor.emit('modalOrPanelHide')
  }
}

export default PanelAndModal
