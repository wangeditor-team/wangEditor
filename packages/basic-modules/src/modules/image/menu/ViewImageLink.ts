/**
 * @description view image link menu
 * @author wangfupeng
 */

import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { EXTERNAL_SVG } from '../../../constants/icon-svg'
import { ImageElement } from '../custom-types'

class ViewImageLink implements IButtonMenu {
  readonly title = t('image.viewLink')
  readonly iconSvg = EXTERNAL_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    const imageNode = DomEditor.getSelectedNodeByType(editor, 'image')
    if (imageNode) {
      // 选区处于 image node
      return (imageNode as ImageElement).href || ''
    }
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 无需 active
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const href = this.getValue(editor)
    if (href) {
      // 有 image href ，则不禁用
      return false
    }
    return true
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    if (!value || typeof value !== 'string') {
      throw new Error(`View image link failed, image.href is '${value}'`)
      return
    }

    // 查看链接
    window.open(value, '_blank')
  }
}

export default ViewImageLink
