/**
 * @description unlink menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { UN_LINK_SVG } from '../../../constants/icon-svg'

class UnLink implements IButtonMenu {
  readonly title = t('link.unLink')
  readonly iconSvg = UN_LINK_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const linkNode = DomEditor.getSelectedNodeByType(editor, 'link')
    if (linkNode == null) {
      // 选区未处于 link node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    // 取消链接
    Transforms.unwrapNodes(editor, {
      match: n => DomEditor.checkNodeType(n, 'link'),
    })
  }
}

export default UnLink
