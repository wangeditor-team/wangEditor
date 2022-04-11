/**
 * @description delete image menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { TRASH_SVG } from '../../../constants/icon-svg'

class DeleteImage implements IButtonMenu {
  readonly title = t('image.delete')
  readonly iconSvg = TRASH_SVG
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

    const imageNode = DomEditor.getSelectedNodeByType(editor, 'image')
    if (imageNode == null) {
      // 选区未处于 image node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    // 删除图片
    Transforms.removeNodes(editor, {
      match: n => DomEditor.checkNodeType(n, 'image'),
    })
  }
}

export default DeleteImage
