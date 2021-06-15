/**
 * @description unlink menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { checkNodeType, getSelectedNodeByType } from '../../_helpers/node'
import { UN_LINK_SVG } from '../../_helpers/icon-svg'

class UnLink implements IButtonMenu {
  title = '取消链接'
  iconSvg = UN_LINK_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const linkNode = getSelectedNodeByType(editor, 'link')
    if (linkNode) {
      // 选区处于 link node
      return true
    }
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const linkNode = getSelectedNodeByType(editor, 'link')
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
      match: n => checkNodeType(n, 'link'),
    })
  }
}

export default UnLink
