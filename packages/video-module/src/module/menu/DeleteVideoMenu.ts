/**
 * @description delete video menu
 * @author wangfupeng
 */

import { Transforms } from 'slate'
import { IButtonMenu, IDomEditor } from '@wangeditor/core'
import { checkNodeType, getSelectedNodeByType } from '../_helpers/node'
import { TRASH_SVG } from '../../constants/svg'

class DeleteVideoMenu implements IButtonMenu {
  title = '删除视频'
  iconSvg = TRASH_SVG
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    // 无需获取 val
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    const videoNode = getSelectedNodeByType(editor, 'video')
    if (videoNode) {
      // 选区处于 video node
      return true
    }
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    if (editor.selection == null) return true

    const videoNode = getSelectedNodeByType(editor, 'video')
    if (videoNode == null) {
      // 选区未处于 video node ，则禁用
      return true
    }
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return

    // 删除视频
    Transforms.removeNodes(editor, {
      match: n => checkNodeType(n, 'video'),
    })
  }
}

export default DeleteVideoMenu
