/**
 * @description view link menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { getSelectedNodeByType } from '../../_helpers/node'
import { EXTERNAL_SVG } from '../../../constants/icon-svg'

class ViewLink implements IButtonMenu {
  title = '查看链接'
  iconSvg = EXTERNAL_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    const linkNode = getSelectedNodeByType(editor, 'link')
    if (linkNode) {
      // @ts-ignore 选区处于 link node
      return linkNode.url || ''
    }
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
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

    if (!value || typeof value !== 'string') {
      throw new Error(`View link failed, link url is '${value}'`)
      return
    }

    // 查看链接
    window.open(value, '_blank')
  }
}

export default ViewLink
