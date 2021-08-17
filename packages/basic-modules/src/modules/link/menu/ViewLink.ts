/**
 * @description view link menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { EXTERNAL_SVG } from '../../../constants/icon-svg'
import { LinkElement } from '../custom-types'

class ViewLink implements IButtonMenu {
  readonly title = t('link.view')
  readonly iconSvg = EXTERNAL_SVG
  readonly tag = 'button'

  private getSelectedLinkElem(editor: IDomEditor): LinkElement | null {
    const node = DomEditor.getSelectedNodeByType(editor, 'link')
    if (node == null) return null
    return node as LinkElement
  }

  getValue(editor: IDomEditor): string | boolean {
    const linkElem = this.getSelectedLinkElem(editor)
    if (linkElem) {
      return linkElem.url || ''
    }
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const linkElem = this.getSelectedLinkElem(editor)
    if (linkElem == null) {
      // 选区未处于 link node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    if (!value || typeof value !== 'string') {
      throw new Error(`View link failed, link url is '${value}'`)
    }

    // 查看链接
    window.open(value, '_blank')
  }
}

export default ViewLink
